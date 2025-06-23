import type { Props } from "../../../types";

export default function CategoryList({ categories }: Props) {
    return (
        <div className="flex flex-wrap justify-around mb-6">
            {categories.map((cat) => (
                cat.show && (                
                    <a href={`/category/${cat.title}`}>
                        <span key={cat.id} className="text-gray-800 px-4 py-1 text-center rounded-full text-lg font-semibold hover:scale-110 cursor-pointer duration-300 m-2">
                            <img className="rounded-full w-20 transition-all hover:scale-125" src={cat.img}/>
                            <p className="text-sm mt-1.5">{cat.title}</p>
                        </span>
                    </a>
                )
            ))}
        </div>
    );
}
