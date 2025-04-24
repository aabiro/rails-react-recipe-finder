# app/controllers/api/v1/recipes_controller.rb
# Create this controller to handle recipe requests
class ApplicationController < ActionController::API
      # GET /api/v1/recipes
      # GET /api/v1/recipes?search=chicken
      def index
        # --- Mock Data ---
        # In a real app, you would fetch this from a database
        # or an external recipe API (like Spoonacular, Edamam)
        all_recipes = [
          { id: 1, title: "Chicken Parmesan", ingredients: "Chicken, Tomato Sauce, Cheese, Pasta", instructions: "Bread chicken, fry, top with sauce and cheese, bake. Serve over pasta.", image_url: "https://placehold.co/600x400/f4a261/ffffff?text=Chicken+Parm" },
          { id: 2, title: "Vegetable Stir-Fry", ingredients: "Broccoli, Carrots, Bell Peppers, Soy Sauce, Rice", instructions: "Chop veggies, stir-fry in wok, add soy sauce. Serve over rice.", image_url: "https://placehold.co/600x400/2a9d8f/ffffff?text=Veggie+Stir-Fry" },
          { id: 3, title: "Spaghetti Carbonara", ingredients: "Spaghetti, Eggs, Pancetta, Parmesan Cheese, Black Pepper", instructions: "Cook spaghetti. Fry pancetta. Whisk eggs and cheese. Combine all.", image_url: "https://placehold.co/600x400/e9c46a/ffffff?text=Carbonara" },
          { id: 4, title: "Chocolate Chip Cookies", ingredients: "Flour, Sugar, Butter, Eggs, Chocolate Chips", instructions: "Cream butter and sugar, add eggs, mix dry ingredients, add chips. Bake.", image_url: "https://placehold.co/600x400/e76f51/ffffff?text=Cookies" },
           { id: 5, title: "Classic Beef Tacos", ingredients: "Ground Beef, Taco Shells, Lettuce, Tomato, Cheese, Taco Seasoning", instructions: "Brown beef, drain fat, add seasoning. Assemble tacos.", image_url: "https://placehold.co/600x400/a8dadc/000000?text=Beef+Tacos" },
          { id: 6, title: "Lentil Soup", ingredients: "Lentils, Carrots, Celery, Onion, Vegetable Broth", instructions: "Sauté vegetables, add lentils and broth, simmer until tender.", image_url: "https://placehold.co/600x400/457b9d/ffffff?text=Lentil+Soup" }
        ]
        # --- End Mock Data ---

        if params[:search].present?
          search_term = params[:search].downcase
          # Filter recipes based on the search term (checking title or ingredients)
          @recipes = all_recipes.filter do |recipe|
            recipe[:title].downcase.include?(search_term) ||
            recipe[:ingredients].downcase.include?(search_term)
          end
        else
          # Return all recipes if no search term is provided
          @recipes = all_recipes
        end

        render json: @recipes
      end

      # --- Optional: Add a Recipe Model ---
      # If you were using a database:
      # 1. Generate a model: `rails generate model Recipe title:string ingredients:text instructions:text image_url:string`
      # 2. Run migrations: `rails db:migrate`
      # 3. Seed data: Add recipes in `db/seeds.rb` and run `rails db:seed`
      # 4. Update the controller: Replace mock data with `Recipe.all` or `Recipe.where(...)`
    end