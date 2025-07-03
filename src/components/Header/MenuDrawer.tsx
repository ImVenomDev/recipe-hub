import { useState } from "react";
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from "@heroui/react";
import { ChevronDown, Clock, Cookie, ForkKnife, Gem, Home, PlusCircle, Shield, Star } from "lucide-react";
import type { Category } from "../../types";
import ModalCreate from "../Recipes/RecipeCreate";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from '../../../firebase.config';

type DrawerProps = {
    isOpen: boolean;
    onOpenChange: () => void;
    categories: Category[];
};

export default function MenuDrawer({ isOpen, onOpenChange, categories }: DrawerProps) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen((prev) => !prev);

    return (
        <>
            <Drawer isOpen={isOpen} placement="left" size="xs" onOpenChange={onOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                <a href="/"><img src='/assets/logo-black.svg'/></a>
                            </DrawerHeader>
                            <DrawerBody>
                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer">
                                    <Home />Home
                                </p>
                                <Dropdown onOpenChange={setDropdownOpen}>
                                    <DropdownTrigger>
                                        <div className="flex items-center justify-between w-full cursor-pointer">
                                            <span className="flex items-center gap-2 text-purple-900"><ForkKnife />Ricette</span>
                                            <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}/>
                                        </div>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Categorie">
                                        {categories.map((category) => (
                                            <DropdownItem key={category.id} onPress={onClose}>
                                                {category.title}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>

                                {/* SCOPRI ANCHE */}

                                <p className="uppercase text-md mt-5 text-gray-500">Scopri anche</p>
                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer">
                                    <Clock />
                                    Ultime ricette
                                </p>
                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer">
                                    <Star />
                                    Più popolari
                                </p>
                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer">
                                    <Cookie />
                                    Proteiche
                                </p>
                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer">
                                    <Gem />
                                    Piatti unici
                                </p>
                                
                                {/* SERVIZI */}

                                <p className="uppercase text-md mt-5 text-gray-500">Servizi</p>

                                <p className="flex items-center gap-2 text-purple-900 cursor-pointer" onClick={() => user ? toggleModal() : navigate('/login')}>
                                    <PlusCircle />
                                    Aggiungi nuova ricetta
                                </p>
                                {user?.admin && (
                                    <>
                                        <p className="uppercase text-md mt-5 text-gray-500">Amministrazione</p>

                                        <p className="flex items-center gap-2 text-purple-900 cursor-pointer" onClick={() => navigate('/admin')}>
                                            <Shield />
                                            Pannello di controllo
                                        </p>
                                    </>
                                )}
                                <div className="mt-5 w-full">
                                    {loading ? (
                                        <Spinner size="sm" />
                                    ) : user ? (
                                        <>
                                            {/* Replace User icon with Avatar for user profile */}
                                            <Button
                                                className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm w-full"
                                                onPress={() => auth.signOut()}
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            className="bg-[#9340ff] text-white font-semibold px-4 py-1 text-sm w-full"
                                            onPress={() => navigate('/login')}
                                        >
                                            Accedi
                                        </Button>
                                    )}
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Chiudi
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
            <ModalCreate isOpen={isModalOpen} onOpenChange={toggleModal} />
        </>
  );
}
