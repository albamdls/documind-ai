from fastapi import FastAPI

app = FastAPI(title="DocuMind AI Backend")


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}