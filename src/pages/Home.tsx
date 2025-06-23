import { useEffect, useState } from 'react'
import { getData } from '../../firebase.config'
import CategoryList from '../components/Home/Categories/CategoryList'
import RecipeSection from '../components/Home/Recipes/RecipeSection'
import type { Category, Recipe } from '../types'

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cat = await getData<Category>('categories');
      const rec = await getData<Recipe>('recipes');
      setCategories(cat);
      setRecipes(rec);
    };
    fetchData();
  }, []);

    return (
        <>
            <main className="p-6 bg-gray-50">
                <CategoryList categories={categories} />

                {categories.map((category) => {
                    const filteredRecipes = recipes.filter(recipe => recipe.category === category.title);
                    return (
                        <RecipeSection key={category.id} recipes={filteredRecipes} />
                    );
                })}
            </main>
        </>
    );
}

export default App;
