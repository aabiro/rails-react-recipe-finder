## rails-react-recipe-finder

# Recipe Finder API Documentation

This document describes the API endpoints for the Recipe Finder application.Base URL:The base URL for the deployed API is assumed to be: https://rails-react-recipe-finder.onrender.com/ (Replace with your actual deployed URL if different). All endpoint paths below are relative to this base URL.Endpoints1. List RecipesFetches a list of recipes. Can optionally be filtered by a search term applied to the recipe title or ingredients.Method: GETPath: /api/v1/recipesQuery Parameters:search (string, optional): A search term to filter recipes. The search is case-insensitive and matches against recipe titles and ingredients.Success Response (200 OK):Returns a JSON array of recipe objects matching the search criteria (or all recipes if no search term is provided).Example Body (All Recipes):[
  {
    "id": 1,
    "title": "Chicken Parmesan",
    "ingredients": "Chicken, Tomato Sauce, Cheese, Pasta",
    "instructions": "Bread chicken, fry, top with sauce and cheese, bake. Serve over pasta.",
    "image_url": "https://placehold.co/600x400/f4a261/ffffff?text=Chicken+Parm",
    "created_at": "2025-04-24T14:15:00.000Z",
    "updated_at": "2025-04-24T14:15:00.000Z"
  },
  {
    "id": 7,
    "title": "Roasted Potatoes",
    "ingredients": "Potato, Olive Oil, Rosemary, Salt, Pepper",
    "instructions": "Cut potatoes, toss with oil and seasonings, roast until golden brown.",
    "image_url": "https://placehold.co/600x400/d4a373/ffffff?text=Roasted+Potatoes",
    "created_at": "2025-04-24T14:16:00.000Z",
    "updated_at": "2025-04-24T14:16:00.000Z"
  }
  // ... other recipes
]
Example Body (Search for "potato"):[
  {
    "id": 7,
    "title": "Roasted Potatoes",
    "ingredients": "Potato, Olive Oil, Rosemary, Salt, Pepper",
    "instructions": "Cut potatoes, toss with oil and seasonings, roast until golden brown.",
    "image_url": "https://placehold.co/600x400/d4a373/ffffff?text=Roasted+Potatoes",
    "created_at": "2025-04-24T14:16:00.000Z",
    "updated_at": "2025-04-24T14:16:00.000Z"
  }
]
Example Body (Search with no results):[]
Error Responses:500 Internal Server Error: Returned if there's an issue on the server processing the request.2. Root Path (List All Recipes)Fetches the complete list of all recipes. This is equivalent to calling /api/v1/recipes without any search parameters.Method: GETPath: /Query Parameters: NoneSuccess Response (200 OK):Returns a JSON array of all recipe objects.Example Body: (Same as /api/v1/recipes without search)[
  {
    "id": 1,
    "title": "Chicken Parmesan",
    // ... other fields ...
  },
  // ... all other recipes
]
Error Responses:500 Internal Server Error: Returned if there's an issue on the server processing the request.(Note: This documentation reflects the current state of the API with only the index action. If you add show, create, update, or destroy actions, they should be documented similarly, including request body parameters and potential error responses like 404 Not Found or 422 Unprocessable Entity.)
