# Documentación Técnica del Backend — NextStepCV

## Índice

1. [Introducción](#1-introducción)
2. [Arquitectura general](#2-arquitectura-general)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Configuración y variables de entorno](#4-configuración-y-variables-de-entorno)
5. [Funcionamiento del backend](#5-funcionamiento-del-backend)
6. [Flujo de una petición (create → download)](#6-flujo-de-una-petición-create--download)
7. [Servicio de PDF](#7-servicio-de-pdf)
8. [Esquemas de datos (schemas)](#8-esquemas-de-datos-schemas)
9. [Sistema de traducciones](#9-sistema-de-traducciones)
10. [Almacenamiento temporal y descarga por token](#10-almacenamiento-temporal-y-descarga-por-token)
11. [Rutas expuestas (API)](#11-rutas-expuestas-api)
12. [Cómo crear nuevas plantillas HTML](#12-cómo-crear-nuevas-plantillas-html)
13. [Tests](#13-tests)
14. [Puesta en marcha](#14-puesta-en-marcha)

---

## 1. Introducción

El backend de **NextStepCV** es una API construida con **Python 3.12** y **FastAPI** cuyo objetivo principal es:

- Recibir los datos de un currículum (en formato JSON).
- Renderizarlos sobre una **plantilla HTML** (Jinja2).
- Convertir ese HTML a un **PDF autocontenido** mediante **WeasyPrint**.
- Exponer un **enlace de descarga temporal** protegido por un **token de un solo uso** y con una **TTL** (tiempo de vida).

No utiliza base de datos: los PDFs se generan bajo demanda, se almacenan temporalmente en disco y se eliminan automáticamente tras su expiración o tras ser descargados.

---

## 2. Arquitectura general

```
                    Flujo principal
+----------------+      POST /create_resume      +-----------------------+
|  Frontend      | ─────────────────────────────▶ │  FastAPI (resumes.py) |
|  (React/Vite)  │      (multipart form)          └───────────┬───────────┘
+----------------+                                          │
                                                            ▼
                                          +-------------------------------+
                                          │  resume.py (parse)           │
                                          │  schemas (validación)        │
                                          +-------------------------------+
                                                            │
                                                            ▼
                                          +-------------------------------+
                                          │  PdfService.generate()        │
                                          │  Jinja2 → HTML → WeasyPrint   │
                                          +-------------------------------+
                                                            │
                                                            ▼
                                          +-------------------------------+
                                          │  ResourceStore (token + TTL)  │
                                          │  escribe PDF en /tmp/cvs      │
                                          +-------------------------------+
                                                            │
                                          responde {download_url}        │
+----------------+      GET /download/{token}               │
|  Cliente       │ ◀────────────────────────────────────────┤
+----------------+   FileResponse application/pdf            │
```

Componentes:

- **API layer** (`app/api/`): routers de FastAPI con los endpoints.
- **Services layer** (`app/services/`): lógica de negocio (parseo y generación de PDF).
- **Schemas layer** (`app/schemas/`): modelos Pydantic que validan y tipan los datos.
- **Storage layer** (`app/storage/`): almacén temporal de PDFs y gestión de tokens.
- **Core** (`app/core/`): configuración de la app (lectura de `.env`).
- **Templates** (`app/templates/`): plantillas HTML + CSS usadas para generar el PDF.
- **Translations** (`app/translations/`): diccionarios de internacionalización (es/en).

---

## 3. Estructura del proyecto

```
backend/
├── pyproject.toml            # Definición del paquete y dependencias (uv/hatchling)
├── uv.lock                   # Lockfile de dependencias
├── .env.example              # Ejemplo de variables de entorno
├── .python-version           # Versión de Python (3.12)
└── app/
    ├── main.py               # App FastAPI, CORS, lifespan (sweeper)
    ├── init.py               # Entry point (uvicorn) para arrancar el servidor
    ├── core/
    │   └── config.py         # Settings de Pydantic (variables de entorno)
    ├── api/
    │   └── v1/
    │       └── resumes.py    # Endpoints /create_resume y /download/{token}
    ├── services/
    │   ├── resume.py         # Parseo del payload y normalización de idioma
    │   └── pdf.py            # PdfService: render HTML + conversión a PDF
    ├── schemas/
    │   ├── __init__.py       # Exporta modelos y parse_resume_data
    │   ├── common.py         # Tipos compartidos (contacto, exp, edu, idiomas)
    │   ├── base.py           # BaseResumeData (currículo genérico)
    │   └── developer.py      # DeveloperResumeData (amplía el base)
    ├── storage/
    │   └── store.py          # ResourceStore (tokens, TTL, limpieza)
    ├── templates/
    │   ├── base.html         # Plantilla base (header/sección perfil)
    │   ├── generic.html      # Plantilla del currículo genérico
    │   ├── developer.html    # Plantilla del currículo developer
    │   ├── macros.html       # Macros reutilizables de Jinja2
    │   └── css/styles.css    # Estilos aplicados al PDF
    ├── translations/
    │   ├── es.json           # Traducciones en español
    │   └── en.json           # Traducciones en inglés
    └── tests/
        ├── api_test.py       # Test funcional de la API
        ├── pdf_test.py       # Test unitario del PdfService
        └── mock_data.py      # Datos y foto de ejemplo para tests
```

---

## 4. Configuración y variables de entorno

Las opciones se definen mediante **Pydantic Settings** en `app/core/config.py`. Todos los valores se leen del archivo `.env` del directorio del backend (aunque admiten anulación por variables de entorno del sistema, que tienen prioridad).

El archivo `.env` se localiza siempre mediante una **ruta absoluta** (`BASE_DIR / ".env"`, donde `BASE_DIR` es la raíz del backend calculada desde `config.py`), por lo que **no depende del directorio de trabajo** desde el que se arranque el proceso.

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `BACKEND_HOST` | `str` | `127.0.0.1` | Host de escucha de uvicorn. |
| `BACKEND_PORT` | `int` | `8000` | Puerto de escucha de uvicorn. |
| `PDF_TTL_SECONDS` | `int` | `600` (10 min) | Tiempo de vida del enlace de descarga. |
| `DOWNLOAD_ONCE` | `bool` | `true` | Si es `true`, el token solo permite una descarga y luego se elimina. |
| `CLEANUP_INTERVAL_SECONDS` | `int` | `300` | Frecuencia del barrido de recursos expirados. |
| `PDF_OUTPUT_DIR` | `Path` | `/tmp/cvs` | Carpeta temporal donde se escriben los PDFs activos. |
| `MAX_IMAGE_SIZE_BYTES` | `int` | `10485760` (10 MB) | Tamaño máximo del archivo de foto de perfil. |
| `ALLOWED_ORIGINS` | `list[str]` | `["*"]` | Orígenes permitidos por CORS (JSON array). |

Ejemplo (`backend/.env`):

```env
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
PDF_TTL_SECONDS=600
DOWNLOAD_ONCE=true
CLEANUP_INTERVAL_SECONDS=300
PDF_OUTPUT_DIR=/tmp/cvs
MAX_IMAGE_SIZE_BYTES=10485760
ALLOWED_ORIGINS=["http://localhost:5173"]
```

---

## 5. Funcionamiento del backend

### 5.1 Arranque (`app/init.py`)

Se ejecuta con `uv run python -m app.init`. Lanza **uvicorn** apuntando a `app.main:app` con `reload=True`, usando el host y puerto de configuración.

### 5.2 Aplicación FastAPI (`app/main.py`)

- Crea la instancia de `FastAPI(title="NextStepCV API", version="0.1.0")`.
- Añade **CORS middleware** con los orígenes configurados.
- Registra el router de `resumes` (`/api/v1`).
- Expone `GET /health` devolviendo `{"status": "ok"}`.

### 5.3 Ciclo de vida (lifespan)

En el arranque (`lifespan`):

1. Crea el directorio de salida `PDF_OUTPUT_DIR` si no existe.
2. Ejecuta `store.cleanup_all()`: **vacía por completo el directorio** y limpia todos los tokens en memoria (los PDFs del arranque anterior se descartan).
3. Lanza una **tarea asíncrona en background** (`_sweeper_loop`) que, en bucle infinito y cada `CLEANUP_INTERVAL_SECONDS`:
   - Asegura que el directorio de salida exista.
   - Llama a `store.sweep()`, que borra todos los tokens **expirados**.

Al cerrar la aplicación, la tarea del *sweeper* se cancela.

---

## 6. Flujo de una petición (create → download)

### 6.1 `POST /api/v1/create_resume`

1. Se recibe un **formulario multipart** con:
   - `data`: JSON (string) con los datos del currículo.
   - `lang` (opcional): código de idioma (`es`/`en`).
   - `profile_image` (opcional): archivo de imagen de perfil.
2. Se valida el JSON con `parse_payload()` → se infiere el tipo de currículo y se valida contra el schema Pydantic. Si el JSON es inválido → `422`.
3. Se normaliza el idioma (`normalize_lang`): si no es `es` ni `en`, se usa `es`.
4. Si se envía `profile_image`:
   - Se verifica que el `content_type` empiece por `image/` (si no → `422`).
   - Se comprueba el tamaño máximo (`413` si supera `MAX_IMAGE_SIZE_BYTES`).
5. Se genera un **token** (`secrets.token_urlsafe(24)`) y un espacio de trabajo:
   `<PDF_OUTPUT_DIR>/<token>/`.
6. Si hay foto, se escribe como `<workspace>/assets/profile_image`.
7. `pdf_service.generate(...)` produce el PDF en `<workspace>/resume.pdf`.
8. Se **registra** el token (con su TTL).
9. Responde `201` con `{"download_url": "/api/v1/download/<token>"}`.

### 6.2 `GET /api/v1/download/{token}`

1. `store.retrieve(token)`:
   - Token inexistente o ya consumido → `404 Invalid download link`.
   - Token expirado → `410 The download link has expired` (y se limpia).
2. `store.consume(token)`: si `DOWNLOAD_ONCE` es `true`, marca el token como consumido.
3. Encola en `background_tasks` la limpieza de los archivos del token (así la descarga se sirve y luego se borra).
4. Devuelve el PDF con `FileResponse`:
   - `media_type="application/pdf"`
   - `filename="resume.pdf"`
   - `content_disposition_type="attachment"` (fuerza la descarga).

---

## 7. Servicio de PDF

### Ubicación

`app/services/pdf.py` — clase `PdfService`.

### Responsabilidad

Convertir un objeto `AnyResumeData` (schema validado) en un **PDF** renderizando una plantilla Jinja2 y convirtiéndola con **WeasyPrint**.

### Inicialización

```python
PdfService(templates_dir: Path, translations_dir: Path)
```

- Configura un entorno Jinja2 con `FileSystemLoader` sobre el directorio de plantillas y `select_autoescape(["html"])`.
- Mantiene un caché (`_translations`) de los diccionarios de traducción cargados.

### Mapeo tipo → plantilla

```python
TEMPLATE_BY_TYPE = {
    BaseResumeData:        "generic.html",
    DeveloperResumeData:   "developer.html",
}
```

Cada tipo de currículo tiene una plantilla HTML asociada. Si se añade un nuevo tipo de currículo, hay que registrar su plantilla aquí.

### Métodos

#### `translations(lang)` → dict
Carga (y cachea) el JSON de traducción del idioma (`es.json` / `en.json`). Si el idioma no es soportado, usa `es`.

#### `translator(lang)` → callable
Devuelve una función `t(key)` que resuelve claves anidadas con notación de puntos (ej. `t('sections.experience')`). Si la clave no existe, devuelve la propia clave como fallback.

#### `render_html(resume, *, lang, profile_image)` → str
- Selecciona la plantilla según `type(resume)`.
- Renderiza pasando al contexto:
  - `resume`: datos del currículo.
  - `lang`: idioma.
  - `t`: la función traductora.
  - `profile_image`: **data URI** (si se pasó ruta a imagen).
- La foto se incrusta como **data URI** para que el PDF resultante sea **autocontenido** (no dependa de rutas absolutas al convertirse).

#### `_to_data_uri(path)` (staticmethod)
- Abre la imagen con **Pillow** y la redimensiona a un máximo de 512×512 (LANCZOS).
- Si tiene canal alfa → la convierte a `PNG`; si no → `JPEG` (calidad 85).
- Codifica en `base64` y devuelve `data:<mime>;base64,...`.

#### `generate(resume, output_path, *, lang, profile_image)` → Path
- Renderiza el HTML y lo convierte a PDF con:

```python
HTML(string=html, base_url=str(self.templates_dir.resolve())).write_pdf(str(output_path))
```

- Usa `base_url` para que los recursos relativos (como `css/styles.css`) se resuelvan correctamente.
- Devuelve el `Path` de salida.

---

## 8. Esquemas de datos (schemas)

Modelos **Pydantic** que validan el JSON recibido. Los tipos usan los mismos nombres que los del frontend (`frontend/src/components/resume/types/`).

### Tipos compartidos (`app/schemas/common.py`)

```python
PersonalInfo:
    firstName: str
    lastName: str
    title: str
    email: str
    phone: str
    location: str
    website: str = ""
    summary: str

ExperienceItem:
    id: str
    company: str
    role: str
    startDate: str
    endDate: str          # "present" indica que sigue activo
    highlights: list[str]

EducationItem:
    id: str
    institution: str
    degree: str
    startDate: str
    endDate: str

LanguageProficiency = Literal[
    "a1","a2","b1","b2","c1","c2",
    "native","fluent","intermediate","basic"
]

LanguageItem:
    language: str
    proficiency: LanguageProficiency
```

### Currículo genérico (`app/schemas/base.py`)

```python
BaseResumeData:
    personalInfo: PersonalInfo
    experience: list[ExperienceItem]
    education: list[EducationItem]
    languages: list[LanguageItem]
```

### Currículo developer (`app/schemas/developer.py`)

Amplía `BaseResumeData`:

```python
TechnicalSkills:
    languagesAndFrameworks: list[str]
    toolsAndDatabases: list[str]

Repository:
    name: str
    description: str
    url: str

DeveloperResumeData(BaseResumeData):
    technicalSkills: TechnicalSkills
    githubProfile: str = ""
    repositories: list[Repository] = Field(default_factory=list)
```

### Inferencia del tipo (`app/schemas/__init__.py`)

El frontend **no envía un campo `resume_type`**, por lo que `parse_resume_data()` infiere el tipo **a partir de la presencia de `technicalSkills`** (campo exclusivo de `DeveloperResumeData`):

- Si `technicalSkills` está presente → `DeveloperResumeData`.
- Si no → `BaseResumeData`.

> Si se añade un nuevo tipo de currículo, debe actualizarse esta función de inferencia.

---

## 9. Sistema de traducciones

- Los diccionarios viven en `app/templates/../translations/*.json` (`es.json`, `en.json`).
- Solo se soportan `es` y `en` (constante `SUPPORTED_LANGS` en `app/services/resume.py`).
- `PdfService.translator(lang)` devuelve una función `t(key)` con estas reglas:
  - Claves anidadas separadas por `.` (ej. `proficiencies.native`).
  - Clave ausente → devuelve la clave literal (fallback seguro).
  - Idioma no soportado → cae a `es`.

Estructura de ejemplo (`es.json`):

```json
{
  "sections": { "experience": "Experiencia", "...": "..." },
  "labels": { "from": "Desde", "present": "Presente", "...": "..." },
  "proficiencies": { "native": "Nativo", "c1": "C1", "...": "..." }
}
```

---

## 10. Almacenamiento temporal y descarga por token

### Ubicación

`app/storage/store.py` — clase `ResourceStore` (instancia global `store`).

### Estructura en disco por token

```
<PDF_OUTPUT_DIR>/<token>/
├── resume.pdf
└── assets/
    └── profile_image
```

### Registro en memoria

Los tokens se guardan en un `dict` en memoria: `token → Resource`. Cada `Resource` contiene:

- `workspace: Path` — carpeta del token en disco.
- `expires_at: datetime` — momento de expiración (`now + ttl_seconds`).

Adicionalmente hay un `set` `_consumed` con los tokens ya descargados.

### Métodos principales

| Método | Descripción |
|---|---|
| `new_token()` | Genera un token aleatorio seguro (`secrets.token_urlsafe(24)`). |
| `workspace(token)` | Crea y devuelve la carpeta `<dir>/<token>/`. |
| `register(token, workspace)` | Añade el token al registro con su `expires_at`. |
| `retrieve(token)` | Devuelve la ruta del PDF si el token es válido y no expirado. Lanza `TokenNotFoundError` o `TokenExpiredError`. |
| `consume(token)` | Si `download_once` es `true`, marca el token como consumido (cierra la ventana de descarga). |
| `cleanup(token)` | Borra los archivos del token y su registro. |
| `cleanup_all()` | Vacía el directorio y limpia toda la memoria (se ejecuta al arrancar). |
| `sweep()` | Borra todos los tokens expirados y devuelve cuántos eliminó. |

### Errores

- `TokenNotFoundError` → se traduce a `HTTP 404`.
- `TokenExpiredError` → se traduce a `HTTP 410`.

### Comportamiento de descarga única

Con `DOWNLOAD_ONCE=true`:

1. Primer `GET /download/{token}` → `consume()` marca el token.
2. El servidor encola la limpieza en background (la respuesta ya se sirve).
3. Cualquier nueva petición con ese token → `404` (porque el token está en `_consumed` y además sus archivos ya se borraron).

Con `DOWNLOAD_ONCE=false`, el token seguiría disponible hasta que caduque por TTL.

---

## 11. Rutas expuestas (API)

Prefijo base: `/api/v1`

### `GET /health`

Devuelve el estado del servicio.

```json
{ "status": "ok" }
```

### `POST /api/v1/create_resume`

Crea un currículo y genera su enlace de descarga. **Content-Type: `multipart/form-data`**.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `data` | `string` (JSON) | Sí | Datos del currículo (ver sección 8). |
| `lang` | `string` | No | `es` o `en`; si no, usa `es`. |
| `profile_image` | `file` | No | Foto de perfil. Debe ser imagen y ≤ `MAX_IMAGE_SIZE_BYTES`. |

**Respuesta `201 Created`:**

```json
{
  "download_url": "/api/v1/download/<token>"
}
```

**Errores:**
- `422` — `data` no es JSON válido, o `profile_image` no es una imagen.
- `413` — la imagen supera el tamaño máximo.

### `GET /api/v1/download/{token}`

Descarga el PDF asociado al token.

**Respuesta `200 OK`:** descarga archivo `resume.pdf` (`application/pdf`, `Content-Disposition: attachment`).

**Errores:**
- `404` — token inválido o ya consumido (`Invalid download link`).
- `410` — el enlace ha expirado (`The download link has expired`).

---

## 12. Cómo crear nuevas plantillas HTML

El sistema está diseñado para que añadir una plantilla (o un nuevo tipo de currículo) sea sencillo. Pasos:

### 12.1 Crear el archivo de plantilla

Crea tu plantilla en `backend/app/templates/`. La forma recomendada es **heredar de `base.html`** y sobrescribir el bloque `sections`, reutilizando las macros de `macros.html`.

```html
{% extends "base.html" %}

{% from "macros.html" import date_range, bullet_list, highlight_list %}

{% block sections %}
    {# Tus secciones aquí, usando resume.* y t() #}
{% endblock %}
```

- `base.html` ya renderiza: encabezado con nombre/título/contacto, la foto (si existe) y el bloque `profile` (resumen).
- `resume` es un **objeto** (Pydantic model). Accede a sus atributos con `resume.personalInfo.firstName`, `resume.experience`, etc.
- `t` es la **función traductora**: `t('sections.experience')`.
- `profile_image` contiene la **data URI** de la foto (o es falsy si no hay).

### 12.2 Macros disponibles (`macros.html`)

| Macro | Uso |
|---|---|
| `date_range(item, t)` | Renderiza un rango de fechas; si `endDate == 'present'`, muestra el texto de "Presente" traducido. |
| `bullet_list(items)` | Lista de etiquetas (pills) para habilidades/tecnologías. |
| `highlight_list(items)` | Lista de logros/highlights. |

### 12.3 Añadir estilos (`css/styles.css`)

Los estilos se aplican directamente al PDF (WeasyPrint usa la hoja `css/styles.css` referenciada en `base.html`). Puedes añadir clases nuevas aquí. Recuerda que WeasyPrint soporta `@page`, `page-break-*`, `size: A4`, etc.

### 12.4 Registrar la plantilla

Si tu plantilla corresponde a **un nuevo tipo de currículo**:

1. Crea el schema en `app/schemas/` (heredando de `BaseResumeData` si aplica) y expórtalo en `app/schemas/__init__.py`.
2. Añade la entrada al mapa `TEMPLATE_BY_TYPE` en `app/services/pdf.py`:

```python
TEMPLATE_BY_TYPE = {
    BaseResumeData:      "generic.html",
    DeveloperResumeData: "developer.html",
    MiNuevoResumeData:   "mi_plantilla.html",
}
```

3. Actualiza la **inferencia de tipo** en `app/schemas/__init__.py` (`parse_resume_data`) para detectar tu nuevo tipo a partir del JSON recibido (por la presencia de algún campo exclusivo).

> Nota: si solo quieres **reutilizar** la misma estructura de datos pero con un diseño distinto, puedes registrar una plantilla adicional que use el mismo tipo o generar una variante sin tocar la inferencia de tipo.

### 12.5 Añadir traducciones (si usas texto traducible)

Añade las claves a los archivos `app/translations/es.json` y `app/translations/en.json`, bajo las secciones que correspondan (`sections`, `labels`, `proficiencies`, ...).

> El directorio `app/templates` y `app/translations` se incluyen en el paquete `wheel` mediante `pyproject.toml` (`force-include`), así que estarán disponibles cuando se instale el backend como paquete.

---

## 13. Tests

No usan pytest; son scripts ejecutables que usan aserciones con `print`.

Desde `backend/`:

```bash
# Test unitario del servicio de PDF (genera y valida PDFs)
uv run python -m app.tests.pdf_test

# Test funcional de la API (create/download, expiración, validaciones)
uv run python -m app.tests.api_test
```

### `pdf_test.py` cubre
- Generación de PDF válido (genérico y developer).
- PDF con foto (developer + idioma `en`).
- Render con traducciones en inglés.
- Fallback de idioma a `es` para idiomas no soportados.
- Clave de traducción desconocida → devuelve la clave.

### `api_test.py` cubre
- Crear currículo → `201` con URL de descarga.
- Descargar una vez → `200` y contenido PDF.
- Re-descargar → `404` (descarga única).
- Crear developer con foto e idioma `en`.
- Token expirado → `410`.
- Token inexistente → `404`.
- JSON inválido → `422`.
- Imagen que no es imagen → `422`.

---

## 14. Puesta en marcha

Requisitos: **Python 3.12** y [uv](https://docs.astral.sh/uv/).

```bash
cd backend
cp .env.example .env        # ajusta valores si es necesario
uv sync                     # instala dependencias (fastapi, jinja2, weasyprint, ...)
uv run python -m app.init   # arranca uvicorn en BACKEND_HOST:BACKEND_PORT
```

> WeasyPrint requiere algunas librerías del sistema (Pango, Cairo, etc.) en algunos entornos; pueden ser necesarias antes de la instalación.

Documentación de la API interactiva (Swagger) disponible en `http://127.0.0.1:8000/docs` (proporcionada automáticamente por FastAPI).
