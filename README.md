# Installation Steps

## Backend

- Install dependencies
  - `npm install`
- Install FastAPI, Weaviate, Uvicorn, fitz, PyMuPDF
  - `pip install fastapi weaviate-client uvicorn fitz pymupdf`
- Start Ollama
  - `ollama serve`
- Pull the Ollama models
  - `ollama pull nomic-embed-text`
  - `ollama pull llama3.2`
- Run Weaviate
  - `docker-compose up`
- Run the FastAPI app with Uvicorn
  - `cd backend`
  - `uvicorn main:app --reload`

## Useful Weaviate Documentation

- [Quickstart](https://docs.weaviate.io/weaviate/quickstart/local)
- [Collection CRUD](https://docs.weaviate.io/weaviate/manage-collections/collection-operations)

## Ports

- Weaviate (vector database running in docker)
  - 8080:8080 (REST API)
  - 50051:50051 (gRPC)
- Ollama
  - 11434
