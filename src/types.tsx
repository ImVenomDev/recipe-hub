import type { ReactNode } from "react";

type Category = {
    id: string;
    title: string;
    img: string;
    show: boolean;
};

type Recipe = {
    id: string;
    title: string;
    author: string;
    author_id: string;
    category: string;
    difficulty: number;
    rating: number;
    glutenFree: boolean;
    isProteic: boolean;
    isUnique: boolean;
    notes: string;
    conservation: string;
    hashtags: string[];
    ingredients: Ingredient[];
    steps: string[];
    servings: number;
    totalTime: ReactNode;
    sleepTime: ReactNode;
    risingTime: ReactNode;
    preparationTime: string | (readonly string[] & string) | undefined;
    total_ingredients: ReactNode;
    createdAt: string | number | Date;
    imageUrl: string | undefined;
};

type Props = {
    categories: {
        show: boolean; img: string | undefined; id: string; title: string 
}[];
};

type Ingredient = { 
    name: string; 
    quantity: string;
    unit: string 

};
type RecipeFormProps = {
    categories: string[];
    onSubmit: (data: any) => void;
};

export type { Category, Recipe, Props, Ingredient, RecipeFormProps };