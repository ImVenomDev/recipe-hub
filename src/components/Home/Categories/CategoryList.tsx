import { useNavigate } from "react-router-dom";
import type { Props } from "../../../types";

export default function CategoryList({ categories }: Props) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap justify-around mb-6">
            {categories.map((cat) => (
                cat.show && (                
                    <span onClick={() => navigate(`/category/${cat.title}`)} key={cat.id} className="text-gray-800 px-4 py-1 text-center rounded-full text-lg font-semibold hover:scale-110 cursor-pointer duration-300 m-2">
                        <img loading="lazy" className="rounded-full w-20" src={cat.img}/>
                        <p className="text-sm mt-1.5">{cat.title}</p>
                    </span>
                )
            ))}
        </div>
    );
}
