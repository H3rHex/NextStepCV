from dotenv import load_dotenv

import uvicorn
import os

load_dotenv()

HOST = os.getenv("BACKEND_HOST")
PORT = int(os.getenv("BACKEND_PORT"))

def main() -> None:
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)


if __name__ == "__main__":
    main()