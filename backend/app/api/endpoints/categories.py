import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()


ROOT_DIR = Path(__file__).parent.parent.parent


@router.get("/categories")
async def get_categories():
    try:
        # Make sure the path to your categories.json file is correct
        json_file_path = os.path.join(ROOT_DIR, "categories.json")
        print(json_file_path)

        # Read the JSON file
        with open(json_file_path, encoding="utf-8") as file:
            categories = json.load(file)

        return JSONResponse(content=categories)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Categories file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON file")
