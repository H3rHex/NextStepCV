
import base64
from pathlib import Path

GENERAL_JSON = {
    "personalInfo": {
        "firstName": "Ana",
        "lastName": "Lopez",
        "title": "Diseñadora UX",
        "email": "ana@mail.com",
        "phone": "+34 600 123 456",
        "location": "Madrid, España",
        "website": "https://ana.dev",
        "summary": "Diseñadora de producto con 8 años de experiencia combinando investigación de usuarios y diseño de interfaces para apps móviles y plataformas web.",
    },
    "experience": [
        {
            "id": "exp-1",
            "company": "Studio X",
            "role": "UX Designer Senior",
            "startDate": "2020-01",
            "endDate": "present",
            "highlights": [
                "Rediseño completo de la app móvil con +2M de descargas",
                "Definición y mantenimiento del design system",
                "Mentoría de 3 diseñadoras junior",
            ],
        },
        {
            "id": "exp-2",
            "company": "Agencia Pixel",
            "role": "Diseñadora UI",
            "startDate": "2016-09",
            "endDate": "2019-12",
            "highlights": [
                "Diseño de interfaces para 15+ clientes del sector retail",
                "Colaboración directa con equipos de desarrollo y producto",
            ],
        },
    ],
    "education": [
        {
            "id": "edu-1",
            "institution": "Universidad Complutense de Madrid",
            "degree": "Grado en Diseño Gráfico",
            "startDate": "2011",
            "endDate": "2015",
        }
    ],
    "languages": [
        {"language": "Español", "proficiency": "native"},
        {"language": "Inglés", "proficiency": "c1"},
    ],
}

DEVELOPER_JSON = {
    **GENERAL_JSON,
    "personalInfo": {
        **GENERAL_JSON["personalInfo"],
        "firstName": "Carlos",
        "lastName": "Gómez",
        "title": "Desarrollador Full-stack",
        "email": "carlos@mail.com",
        "summary": "Desarrollador full-stack con 6 años de experiencia construyendo aplicaciones web escalables con Python y TypeScript, especializado en APIs y automatización de procesos.",
    },
    "technicalSkills": {
        "programmingLanguages": [
            "Python",
            "TypeScript",
            "Java",
            "Go",
            "JavaScript",
        ],
        "frameworks": [
            "FastAPI",
            "Django",
            "React",
            "Next.js",
            "Angular",
        ],
        "toolsAndDatabases": [
            "PostgreSQL",
            "Redis",
            "Docker",
            "GitHub Actions",
        ],
    },
    "socialMedia": [
        {
            "id": "social-1",
            "name": "GitHub",
            "username": "carlosg",
            "url": "https://github.com/carlosg",
        },
        {
            "id": "social-2",
            "name": "LinkedIn",
            "username": "carlosg",
            "url": "https://linkedin.com/in/carlosg",
        },
    ],
    "githubProfile": "https://github.com/carlosg",
    "repositories": [
        {
            "name": "nextstepcv",
            "description": "Generador de currículos en PDF a partir de plantillas HTML.",
            "url": "https://github.com/carlosg/nextstepcv",
        },
        {
            "name": "taskflow",
            "description": "Gestor de tareas asíncronas con colas en Redis.",
            "url": "https://github.com/carlosg/taskflow",
        },
    ],
}


def write_mock_photo(directory: Path, file_name: str = "profile_image.png") -> Path:
    photo = directory / file_name
    png_1x1 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8"
        "z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    )
    photo.write_bytes(base64.b64decode(png_1x1))
    return photo