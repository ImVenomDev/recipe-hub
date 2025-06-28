import { Input, Button } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    hashtags: any[];
    setHashtags: React.Dispatch<React.SetStateAction<any[]>>;
    editingHashtag: any;
    setEditingHashtag: React.Dispatch<React.SetStateAction<any>>;
    newHashtag: string;
    setNewHashtag: React.Dispatch<React.SetStateAction<string>>;
    updateDocData: (col: string, id: string, data: any, setter: React.Dispatch<React.SetStateAction<any[]>>) => void;
    deleteDocData: (col: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => void;
    addDocWithReset: (
        col: string,
        data: any,
        reset: () => void,
        setter: React.Dispatch<React.SetStateAction<any[]>>
    ) => void;
};

export default function HashtagSection({
    hashtags,
    setHashtags,
    editingHashtag,
    setEditingHashtag,
    newHashtag,
    setNewHashtag,
    updateDocData,
    deleteDocData,
    addDocWithReset
}: Props) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista Hashtag */}
            <motion.div layout className="bg-white border p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-purple-700">Hashtag</h3>
                <ul className="space-y-2 text-sm">
                    {hashtags.map((tag) => (
                        <li key={tag.id} className="flex justify-between items-center border-b pb-2">
                            <span>{tag.title}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingHashtag(tag)} className="text-blue-600"><Pencil size={16} /></button>
                                <button onClick={() => deleteDocData("hashtags", tag.id, setHashtags)} className="text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Modifica Hashtag */}
                <AnimatePresence>
                    {editingHashtag && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 bg-gray-50 p-4 border rounded-lg"
                        >
                            <Input
                                label="Titolo"
                                value={editingHashtag.title}
                                onChange={(e) => setEditingHashtag({ ...editingHashtag, title: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <Button
                                    onClick={() => {
                                        updateDocData("hashtags", editingHashtag.id, editingHashtag, setHashtags);
                                        setEditingHashtag(null);
                                    }}
                                    className="bg-green-600 text-white"
                                >
                                    Salva
                                </Button>
                                <Button onClick={() => setEditingHashtag(null)}>Annulla</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Nuovo Hashtag */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addDocWithReset("hashtags", { title: newHashtag }, () => setNewHashtag(""), setHashtags);
                }}
                className="bg-white border p-4 rounded-lg shadow-sm space-y-2"
            >
                <h3 className="text-purple-700 font-semibold">Nuovo Hashtag</h3>
                <Input
                    placeholder="#veloce"
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                />
                <Button type="submit" className="bg-purple-600 text-white">Aggiungi</Button>
            </form>
        </section>
    );
}
