from fastapi import APIRouter
import base64
from io import BytesIO
from apps.calculator.utils import analyze_image, get_explanation
from schema import ImageData, ExplanationRequest
from PIL import Image

router = APIRouter()

@router.post('')
async def run(data: ImageData):
    image_data = base64.b64decode(data.image.split(",")[1])  # Assumes data:image/png;base64,<data>
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
    data = []
    for response in responses:
        data.append(response)
    return {"message": "Image processed", "data": data, "status": "success"}

@router.post('/explain')
async def explain(data: ExplanationRequest):
    image_data = base64.b64decode(data.image.split(",")[1])
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    explanation = get_explanation(image, data.question, data.history)
    return {"message": "Explanation generated", "data": explanation, "status": "success"}