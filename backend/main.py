
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Popular Footwear Backend is running!"}