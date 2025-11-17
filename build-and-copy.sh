#!/bin/bash

# Script para build do ngx-css e cópia para o web-ironman
# Uso: ./build-and-copy.sh

set -e

echo "🔨 Iniciando build do ngx-css..."
npm run build

echo "📦 Build concluído!"
echo "📂 Copiando para web-ironman..."

# Define os caminhos
SOURCE_DIR="./dist/@squidit/ngx-css"
TARGET_DIR="../ironman/web-ironman/node_modules/@squidit/ngx-css"

# Verifica se o diretório de origem existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Erro: Diretório de origem não encontrado: $SOURCE_DIR"
    exit 1
fi

# Verifica se o diretório de destino existe
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Erro: Diretório de destino não encontrado: $TARGET_DIR"
    echo "Certifique-se de que o web-ironman tem o @squidit/ngx-css instalado"
    exit 1
fi

# Remove o conteúdo antigo e copia o novo
echo "🗑️  Removendo versão antiga..."
rm -rf "$TARGET_DIR"

echo "📋 Copiando nova versão..."
cp -r "$SOURCE_DIR" "$TARGET_DIR"

echo "✅ Concluído!"
echo "🎯 Lib ngx-css atualizada em web-ironman/node_modules/@squidit/ngx-css"

