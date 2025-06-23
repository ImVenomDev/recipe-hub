import { useParams } from "react-router-dom";
import type { Category } from "../types";

type Props = {
    categories: Category[];
};

export default function CategoryPage({ categories }: Props) {
    const { id } = useParams();

    const matchedCategory = categories.find(
        (cat) => cat.title.toLowerCase() === id?.toLowerCase()
    );

    if (!matchedCategory) {
        return null
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-purple-900">
                {matchedCategory.title}
            </h1>
            <p className="text-gray-700">ID: {matchedCategory.id}</p>
        </div>
  );
}
