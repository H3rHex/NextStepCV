@echo off
SETLOCAL EnableDelayedExpansion

:: Leer el archivo .env para buscar ACTIVATE_IA
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="ACTIVATE_IA" set ACTIVATE_IA=%%b
)

echo 🚀 Iniciando NextStepCV...

:: Levantar contenedores
docker compose up -d

:: Comprobar si la IA está activa (usando el número del .env)
if "%ACTIVATE_IA%"=="1" (
    echo 🤖 IA activada. Verificando motor Ollama...
    timeout /t 5 /nobreak > nul
    echo 📥 Descargando/Verificando modelo de IA...
    docker exec -it ollama-service ollama pull llama3:8b
) else (
    echo 🚫 IA desactivada en el .env.
)

echo ✅ Sistema listo. Accede a http://localhost
pause