#!/bin/bash

# Cargar variables del .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ Error: Archivo .env no encontrado."
    exit 1
fi

echo "🚀 Iniciando NextStepCV..."

# Levantar los contenedores
# 'scale' usará el número que pusiste en el .env
docker compose up -d

if [ "$ENABLE_AI_FEATURES" = "1" ]; then
    echo "🤖 IA activada. Verificando motor Ollama..."
    # Esperar un momento a que Ollama arranque antes de pedirle cosas
    sleep 5
    echo "📥 Asegurando que el modelo de IA esté descargado..."
    docker exec -it ollama-service ollama pull llama3:8b
else
    echo "🚫 IA desactivada según el .env. Saltando configuración de Ollama."
fi

echo "✅ Sistema listo. Accede a http://localhost"