#!/bin/bash

# Adicionar imports padrão em todos os arquivos .tsx
find ./app -name "*.tsx" -type f -exec sed -i '1i\import type { InputChangeEvent, FormInputEvent, TextAreaChangeEvent, Surprise, SurprisePhoto, ImageType } from "@/types";' {} \;

# Atualizar todas as ocorrências de any para os tipos corretos
find ./app -name "*.tsx" -type f -exec sed -i 's/: any/: unknown/g' {} \;
find ./app -name "*.tsx" -type f -exec sed -i 's/useState<any>/useState<unknown>/g' {} \;
find ./app -name "*.tsx" -type f -exec sed -i 's/React.ChangeEvent<HTMLInputElement>/InputChangeEvent/g' {} \;
find ./app -name "*.tsx" -type f -exec sed -i 's/React.FormEvent/FormInputEvent/g' {} \; 