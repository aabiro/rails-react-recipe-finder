require "test_helper"

class Api::V1::RecipesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_recipes_index_url
    assert_response :success
  end
end
