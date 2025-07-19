import type { Recipe } from "../types";

export const generateRecipeSEO = (recipe: Recipe) => {
    const title = `${recipe.title} | Recipe Hub` || "Recipe Hub";
    const description = `Scopri come preparare ${recipe.title} in pochi passi su Recipe Hub. Trova ingredienti, preparazione e consigli per una ricetta perfetta.`;
    const image = recipe.imageUrl || "https://recipe-hub.it/default-recipe.jpg";
    const url = `https://recipe-hub.it/recipe/${recipe.id}`;

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        name: recipe.title,
        image: [image],
        description: description,
        author: {
            "@type": "Person",
            name: recipe.author || "Autore sconosciuto"
        },
        datePublished: recipe.createdAt,
        prepTime: recipe.preparationTime,
    };

    return { title, description, image, url, jsonLd };
};
