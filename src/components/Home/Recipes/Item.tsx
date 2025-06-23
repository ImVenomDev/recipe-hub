import { useNavigate } from "react-router-dom";

export default function Item({ item }: { item: any }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/recipe/${item.id}`)} className="w-2xs mb-1 mr-3 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <p className="text-sm text-red-600 font-medium mb-1">{item.category}</p>
                <h2 className="text-xl font-bold leading-tight mb-8">{item.title}</h2>
                <p className="text-gray-700 text-xs mb-2 font-semibold">{item.author}</p>
                <div className="flex justify-between text-sm text-gray-600 border-t border-gray-300 pt-2">
                    <div className="grid">
                        <span>{item.totalTime}</span>
                        <span>{item.total_ingredients} ingredienti</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
