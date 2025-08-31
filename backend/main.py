from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import weaviate
from weaviate.classes.config import Configure
from pydantic import BaseModel
import json
import fitz 

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Create schema for Weaviate collection
def create_weaviate_collection():
    client = weaviate.connect_to_local()
    client.collections.delete("Document")  # Delete existing collection if any
    try:
        client.collections.create(
            name="Document",
            vector_config=Configure.Vectors.text2vec_ollama(
            api_endpoint="http://host.docker.internal:11434",
            model="nomic-embed-text",
        ),
        generative_config=Configure.Generative.ollama(
            api_endpoint="http://host.docker.internal:11434",
            model="llama3.2",
        ),
        )
    except Exception as e:
        print(f"Schema creation skipped: {e}")
    client.close()

create_weaviate_collection()
print("Weaviate collection created or already exists.")

# Function to extract text from PDF using PyMuPDF (fitz)
def extract_text_from_pdf(file_content):
    print("123 Extracting text from PDF...")
    pdf_document = fitz.open(stream=file_content, filetype="pdf")
    text = ""
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    print(f"123 Finished extracting text from PDF. Total length: {len(text)} characters")
    return text

# Upload document and convert it to embeddings
@app.post("/upload/")
async def upload_document(file: UploadFile = File(...)):
    file_content = await file.read()
    data = extract_text_from_pdf(file_content)

    print(f"123 Extracted text length: {len(data)} characters")
    client = weaviate.connect_to_local()
    collection = client.collections.use("Document")

    uuid = collection.data.insert({
        "text": data
    })
    print(f"123 Inserted document with UUID: {uuid}")

    client.close()
    return {"message": "Document uploaded successfully"}

# Define the request body schema
class QueryRequest(BaseModel):
    query: str
    history: list[dict]

# Query the vector database with a user query
@app.post("/query/")
async def query_document(request: QueryRequest):
    client = weaviate.connect_to_local()
    collection = client.collections.use("Document")

    conversation_context = "\n".join(
        [f"{msg['role']}: {msg['content']}" for msg in request.history]
    )
    conversation_context += f"\nuser: {request.query}"

    generative_response = collection.generate.near_text(
        query=conversation_context,
        limit=2,
        grouped_task="Continue the conversation based on the context provided."
    )

    results = []
    for idx, obj in enumerate(generative_response.generative.text.split("\n")):
        results.append({
            "id": idx + 1,
            "text": obj.strip()
        })
    
    client.close()
    print(generative_response.generative.text)
    return JSONResponse(content={"results": results})