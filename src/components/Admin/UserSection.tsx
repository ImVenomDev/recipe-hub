import { Button } from "@heroui/react";
import type { AppUser } from "../../contexts/AuthContext";

type Props = {
    users: AppUser[];
    updateDocData: (col: string, id: string, data: any, setter: React.Dispatch<React.SetStateAction<any[]>>) => void;
};

export default function UsersSection({ users, updateDocData }: Props) {
    return (
        <section className="bg-white border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">Utenti</h3>
            <ul className="space-y-2 text-sm max-h-64 overflow-auto">
                {users.map((u) => (
                    <li key={u.uid} className="border-b pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium">{u.displayName || "Sconosciuto"}</p>
                                <p className="text-gray-400 text-sm">{u.email}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {u.recipes?.length || 0} ricette | Registrato: {/* puoi aggiungere data */}
                                </p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                                <Button
                                    size="sm"
                                    color={u.admin ? "danger" : "success"}
                                    onPress={() => updateDocData("users", u.uid, { admin: !u.admin }, () => {})}
                                >
                                    {u.admin ? "Rimuovi Admin" : "Rendi Admin"}
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
