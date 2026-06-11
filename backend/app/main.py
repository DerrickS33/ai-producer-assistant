from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Producer Assistant API is running"}