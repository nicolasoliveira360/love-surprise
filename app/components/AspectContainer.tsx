"use client";

interface AspectContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function AspectContainer({ children, className = '' }: AspectContainerProps) {
  return (
    <div className={`relative w-full max-w-[343px] mx-auto ${className}`}>
      {children}
    </div>
  );
} 