import Item from "./Item"
import type { Recipe } from "../../../types"
import SlideCarousel from "./Carousel"

type Props = {
    recipes: Recipe[]
}

export default function RecipeSection({ recipes }: Props) {
    if (recipes.length === 0) return null

    // Raggruppa le ricette per categoria
    const grouped = recipes.reduce<Record<string, Recipe[]>>((acc, recipe) => {
        if (!acc[recipe.category]) acc[recipe.category] = []
        acc[recipe.category].push(recipe)
        return acc
    }, {})

    return (
        <section className="mb-10">
            {Object.entries(grouped).map(([categoryName, categoryRecipes]) => (
                <div key={categoryName} className="mb-8">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2 capitalize">{categoryName}</h3>
                    <SlideCarousel>
                        {categoryRecipes.map((recipe) => (
                        <Item key={recipe.id} item={recipe} />
                        ))}
                    </SlideCarousel>
                </div>
            ))}
        </section>
  )
}
