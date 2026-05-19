## Cómo empezar (GUIA USUARIOS)

1. Descarga el proyecto (o clónalo).

2. Instala Docker (el único requisito).

3. Crea o actualiza el archivo `.env` en la raíz. Usa `.env.example` como plantilla.

4. Para desarrollo local sin Nginx usa:
   - `./scripts/start-dev.sh`
   - Esto arrancará el backend en `http://localhost:8000`, Vite en `http://localhost:3000` y los servicios de soporte (Postgres, MinIO, Ollama).

5. Para producción rápida con Nginx usa:
   - `./scripts/start.sh`
   - Esto arranca la configuración de producción definida en `docker-compose.yml`.

¡Listo! Tu navegador se abrirá en tu panel de control de CVs. 
Todo lo que subas se queda en tu ordenador.

-----------

### Stack Tecnológico

#### **Infraestructura & Orquestación**

* **Docker & Docker Compose:** Contenerización de todo el ecosistema.
* **Nginx:** Reverse Proxy y servidor de archivos estáticos para el frontend.
* **Dev Containers (VS Code):** Entorno de desarrollo aislado y reproducible.

#### **Backend (Python)**

* **FastAPI:** Framework asíncrono para la API de alto rendimiento.
* **LangGraph:** Orquestación de agentes de IA y flujos de trabajo cíclicos.
* **uv:** Gestor de paquetes y entorno virtual ultra-rápido.
* **WeasyPrint:** Motor de renderizado para generar PDFs profesionales desde HTML/CSS.

#### **Frontend (React)**

* **React + TypeScript:** Biblioteca de UI y tipado estático para robustez.
* **Vite:** Herramienta de construcción y servidor de desarrollo rápido.
* **Tailwind CSS:** Framework de diseño basado en utilidades.
* **Framer Motion:** Biblioteca para animaciones y feedback visual.
* **React Router:** Gestión de rutas en el lado del cliente (SPA).

#### **Inteligencia Artificial**

* **Ollama:** Motor de inferencia local para modelos de lenguaje.
* **Qwen 2.5 (3B):** Modelo de lenguaje optimizado para ejecución en local (CPU/GPU).

#### **Persistencia & Almacenamiento**

* **PostgreSQL:** Base de datos relacional para usuarios y metadatos.
* **MinIO:** Servidor de almacenamiento de objetos compatible con S3 para los archivos PDF.