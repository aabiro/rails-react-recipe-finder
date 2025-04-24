import React, { useState, useEffect, useCallback } from "react";
// Assuming Tailwind CSS is set up in your project

// --- Main App Component ---
function App() {
  // State variables
  const [recipes, setRecipes] = useState([]); // Holds the list of recipes
  const [searchTerm, setSearchTerm] = useState(""); // Holds the current search input
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Holds any API error messages
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Holds the recipe selected for detail view

  // --- API URL ---
  // Make sure this matches the port your Rails API is running on
  //
  // src/App.js
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1/recipes";
  // --- Fetch Recipes Function ---
  const fetchRecipes = useCallback(
    async (query = "") => {
      setIsLoading(true); // Start loading
      setError(null); // Clear previous errors
      // Don't clear selected recipe here, allow modal to stay open if user searches while viewing
      // setSelectedRecipe(null);
      let url = API_URL;
      if (query) {
        // Append search query parameter if present
        url += `?search=${encodeURIComponent(query)}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data); // Update recipes state
      } catch (e) {
        console.error("Failed to fetch recipes:", e);
        setError(`Failed to load recipes. ${e.message}`); // Set error message
        setRecipes([]); // Clear recipes on error
      } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
      }
    },
    [API_URL]
  ); // Dependency array includes API_URL

  // --- Initial Fetch ---
  // Fetch all recipes when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]); // fetchRecipes is memoized by useCallback

  // --- Handle Search Input Change ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Handle Search Form Submission ---
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    fetchRecipes(searchTerm); // Fetch recipes based on the current search term
  };

  // --- Handle Recipe Click ---
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the clicked recipe as selected
  };

  // --- Handle Close Detail View ---
  const handleCloseDetail = () => {
    setSelectedRecipe(null); // Clear the selected recipe
  };

  // --- Render Logic ---
  return (
    // Added a subtle gradient background and improved padding
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced header styling */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-orange-600 mb-8 tracking-tight">
          Recipe Finder
        </h1>

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          isLoading={isLoading}
        />

        {/* Loading Indicator */}
        {isLoading && <LoadingSpinner />}

        {/* Error Message Display */}
        {error && <ErrorMessage message={error} />}

        {/* Recipe Display Area - Added margin top */}
        {!isLoading && !error && (
          <div className="mt-10">
            {/* Conditionally render RecipeList or message */}
            {!selectedRecipe &&
              (recipes.length > 0 ? (
                <RecipeList
                  recipes={recipes}
                  onRecipeClick={handleRecipeClick}
                />
              ) : (
                // Display message only if not loading and no recipes found after search/initial load
                (!isLoading && searchTerm && (
                  <p className="text-center text-gray-500 text-lg mt-10">
                    No recipes found matching "{searchTerm}". Try a different
                    search!
                  </p>
                )) ||
                (!isLoading && !searchTerm && recipes.length === 0 && (
                  <p className="text-center text-gray-500 text-lg mt-10">
                    No recipes available.
                  </p>
                ))
              ))}
          </div>
        )}

        {/* Recipe Detail Modal - Rendered outside the main flow */}
        {selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} onClose={handleCloseDetail} />
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12 py-6 border-t border-gray-200">
          Powered by React & Rails | Mock Data Used
        </footer>
      </div>
    </div>
  );
}

// --- Search Bar Component ---
function SearchBar({ searchTerm, onSearchChange, onSearchSubmit, isLoading }) {
  return (
    // Added more margin bottom and centered the form elements better
    <form
      onSubmit={onSearchSubmit}
      className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 px-4"
    >
      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTerm}
        onChange={onSearchChange}
        // Enhanced input styling: larger text, more padding, softer focus ring
        className="px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-full max-w-lg text-base transition duration-150 ease-in-out"
        disabled={isLoading} // Disable input while loading
      />
      <button
        type="submit"
        // Enhanced button styling: rounded-full, better padding, bolder text, smoother transition
        className={`px-8 py-3 rounded-full text-white font-bold shadow-md transition duration-200 ease-in-out transform hover:scale-105 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
        }`}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          // Simple inline spinner for button
          <svg
            className="animate-spin h-5 w-5 text-white inline mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

// --- Recipe List Component ---
function RecipeList({ recipes, onRecipeClick }) {
  // Removed the initial "No recipes found" message from here, handled in App component
  return (
    // Increased gap for better spacing on larger screens
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick(recipe)}
        />
      ))}
    </div>
  );
}

// --- Recipe Item Component (Card View) ---
function RecipeItem({ recipe, onClick }) {
  return (
    <div
      // Enhanced card styling: softer shadow, subtle scale on hover, slightly larger rounding
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out bg-white cursor-pointer transform hover:-translate-y-1 group"
      onClick={onClick} // Handle click on the entire card
    >
      <div className="relative">
        <img
          src={
            recipe.image_url ||
            "https://placehold.co/600x400/cccccc/ffffff?text=No+Image"
          }
          alt={recipe.title}
          // Ensure image covers the area, add aspect ratio consistency
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          // Basic fallback for broken images
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/e0e0e0/999999?text=Image+Error";
          }}
        />
        {/* Optional: Add a subtle overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
      <div className="p-5">
        {/* Improved typography and spacing */}
        <h3 className="font-bold text-xl text-gray-800 mb-2 truncate group-hover:text-orange-600 transition-colors duration-300">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {" "}
          {/* Allow more lines for ingredients */}
          {recipe.ingredients}
        </p>
      </div>
    </div>
  );
}

// --- Recipe Detail Component (Modal) ---
function RecipeDetail({ recipe, onClose }) {
  // Add effect to prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    // Improved modal styling: smoother entry animation, better backdrop, centered content
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in"
      onClick={onClose} // Close modal if backdrop is clicked
    >
      {/* Stop propagation prevents closing modal when clicking inside the content */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Improved close button: positioned better, larger hit area, icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Close recipe details"
        >
          {/* Simple X SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Enhanced title styling */}
        <h2 className="text-3xl font-bold text-orange-600 mb-5 pr-10">
          {recipe.title}
        </h2>

        <div className="md:flex md:gap-8">
          {/* Image Column */}
          <div className="md:w-1/2 mb-4 md:mb-0 flex-shrink-0">
            <img
              src={
                recipe.image_url ||
                "https://placehold.co/600x400/cccccc/ffffff?text=No+Image"
              }
              alt={recipe.title}
              className="w-full h-auto max-h-80 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/e0e0e0/999999?text=Image+Error";
              }}
            />
          </div>

          {/* Text Column (Ingredients & Instructions) */}
          <div className="md:w-1/2">
            <div className="mb-6">
              <h4 className="font-semibold text-xl text-gray-700 mb-2 border-b pb-1 border-orange-200">
                Ingredients:
              </h4>
              {/* Use list for better structure if ingredients are comma-separated */}
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {recipe.ingredients.split(",").map((item, index) => (
                  <li key={index}>{item.trim()}</li>
                ))}
              </ul>
              {/* Fallback for non-comma separated */}
              {/* <p className="text-gray-600 whitespace-pre-line">{recipe.ingredients}</p> */}
            </div>

            <div>
              <h4 className="font-semibold text-xl text-gray-700 mb-2 border-b pb-1 border-orange-200">
                Instructions:
              </h4>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Keep close button at the bottom for consistency if needed, or rely on top-right X */}
        {/* <button
                onClick={onClose}
                className="mt-8 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
            >
                Close
            </button> */}
      </div>
      {/* Add custom CSS for animations if needed */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
        /* Simple scrollbar styling for modal content */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #f97316; /* Orange */
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #ea580c; /* Darker Orange */
        }
      `}</style>
    </div>
  );
}

// --- Loading Spinner Component ---
function LoadingSpinner() {
  return (
    // Centered spinner with slightly more prominent text
    <div className="flex flex-col justify-center items-center p-10 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
      <p className="text-lg text-gray-600 font-semibold">Loading Recipes...</p>
    </div>
  );
}

// --- Error Message Component ---
function ErrorMessage({ message }) {
  return (
    // Slightly improved error message styling
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow max-w-2xl mx-auto text-center"
      role="alert"
    >
      <p className="font-bold">Oops! Something went wrong.</p>
      <p>{message}</p>
    </div>
  );
}

export default App;

// --- To Run the React App ---
// 1. Make sure you have Node.js and npm/yarn installed.
// 2. Create a new React project (if you haven't): `npx create-react-app recipe-finder-frontend`
// 3. Navigate into the project directory: `cd recipe-finder-frontend`
// 4. Install Tailwind CSS (follow official Tailwind guide for Create React App: https://tailwindcss.com/docs/guides/create-react-app)
// 5. Replace the contents of `src/App.js` with the code above.
// 6. Make sure your Rails API server is running (e.g., on port 3001).
// 7. Start the React development server: `npm start` or `yarn start` (usually runs on http://localhost:3000)
