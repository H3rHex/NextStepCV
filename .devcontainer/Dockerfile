FROM mcr.microsoft.com/devcontainers/python:3.11-bookworm

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install system dependencies for PDF processing and OCR
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-cffi \
    python3-brotli \
    libpango-1.0-0 \
    libharfbuzz0b \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    poppler-utils \
    tesseract-ocr \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configuration of workspace and secure user permissions
WORKDIR /workspaces/NextStepCV
RUN chown -R vscode:vscode /workspaces/NextStepCV

USER vscode