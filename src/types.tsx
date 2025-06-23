import type { ReactNode } from "react";

type Category = {
  id: string;
  title: string;
  img: string;
  show: boolean;
};

type Recipe = {
  preparationTime: ReactNode;
  total_ingredients: ReactNode;
  createdAt: string | number | Date;
  imageUrl: string | undefined;
  id: string;
  title: string;
  author: string;
  category: string;
  time: string;
  ingredients: number;
  rating: number;
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