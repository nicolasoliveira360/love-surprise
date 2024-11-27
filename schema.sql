-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recriar a tabela users com configuração correta
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Criar políticas simples e diretas
CREATE POLICY "Allow full access to own user data" ON users
  USING (auth.uid() = id);

-- Criar trigger para inserção automática
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger na tabela auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create surprises table
CREATE TABLE surprises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  couple_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  message TEXT,
  youtube_link TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'active', 'expired')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create surprise_photos table
CREATE TABLE surprise_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  surprise_id UUID REFERENCES surprises(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  surprise_id UUID REFERENCES surprises(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE surprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE surprise_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Surprises policies
CREATE POLICY "Anyone can view active surprises" ON surprises
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view own surprises" ON surprises
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create surprises" ON surprises
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own surprises" ON surprises
  FOR UPDATE USING (user_id = auth.uid());

-- Photos policies
CREATE POLICY "Anyone can view photos of active surprises" ON surprise_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surprises s 
      WHERE s.id = surprise_id 
      AND s.status = 'active'
    )
  );

CREATE POLICY "Users can manage photos of own surprises" ON surprise_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM surprises s 
      WHERE s.id = surprise_id 
      AND s.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to update surprise status
CREATE OR REPLACE FUNCTION update_surprise_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE surprises 
    SET status = 'active',
        expires_at = CASE 
          WHEN plan = 'basic' THEN NOW() + INTERVAL '1 month'
          ELSE NULL
        END
    WHERE id = NEW.surprise_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for payment completion
CREATE TRIGGER on_payment_completed
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE PROCEDURE update_surprise_status();