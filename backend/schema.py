from pydantic import BaseModel

class ImageData(BaseModel):
    image: str
    dict_of_vars: dict

class ExplanationRequest(BaseModel):
    image: str
    question: str
    history: list[dict]