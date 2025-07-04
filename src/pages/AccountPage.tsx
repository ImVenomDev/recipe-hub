// src/pages/AccountPage.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../../firebase.config";
import { doc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { Input, Button, Spinner, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.config";
import { Trash2 } from "lucide-react";
import type { Recipe } from "../types";
import { motion } from "framer-motion";

export default function AccountPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const fetchUserRecipes = async () => {
            if (!user) return;
            setLoadingRecipes(true);
            try {
                const snapshot = await getDocs(collection(db, "recipes"));
                const userRecipes = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Recipe))
                    .filter(r => r.author_id === user.uid);
                setRecipes(userRecipes);

                logEvent(analytics, "account_view_recipes", { uid: user.uid, recipes_count: userRecipes.length });
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingRecipes(false);
            }
        };

        fetchUserRecipes();
    }, [user]);

    const handleUpdateUsername = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid!);
            await updateDoc(userRef, { username });
            logEvent(analytics, "update_username", { uid: user.uid });
            alert("Username aggiornato con successo!");
        } catch (err) {
            console.error(err);
            alert("Errore durante l'aggiornamento dell'username.");
        }
    };

    const handleUpdateEmail = async () => {
        if (!auth.currentUser || !user) return;
        try {
            await updateEmail(auth.currentUser, email);
            const userRef = doc(db, "users", user.uid!);
            await updateDoc(userRef, { email });
            logEvent(analytics, "update_email", { uid: user.uid });
            alert("Email aggiornata con successo!");
        } catch (err) {
            console.error(err);
            alert("Errore durante l'aggiornamento dell'email.");
        }
    };

    const handleResetPassword = async () => {
        if (!auth.currentUser?.email) return;
        try {
            await sendPasswordResetEmail(auth, auth.currentUser.email);
            if (user) {
                logEvent(analytics, "password_reset_requested", { uid: user.uid });
            }
            alert("Email per il reset della password inviata.");
        } catch (err) {
            console.error(err);
            alert("Errore durante l'invio dell'email di reset.");
        }
    };

    const handleDeleteRecipe = async () => {
        if (!deletingId) return;
        try {
            await deleteDoc(doc(db, "recipes", deletingId));
            setRecipes(prev => prev.filter(r => r.id !== deletingId));
            if (user) {
                logEvent(analytics, "delete_recipe", { uid: user.uid, recipeId: deletingId });
            }
            setDeletingId(null);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Errore durante l'eliminazione della ricetta.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner label="Caricamento account..." />
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="max-w-xl mx-auto p-6 pt-24 space-y-6">
            <h1 className="text-2xl font-bold text-purple-800">Account</h1>
            <p className="text-gray-600">Gestisci le tue informazioni e le tue ricette pubblicate.</p>

            <Card>
                <CardHeader>Modifica Informazioni</CardHeader>
                <CardBody className="space-y-3">
                    <Input
                        label="Nome Visualizzato"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onPress={handleUpdateUsername} color="secondary" fullWidth>Salva Nome</Button>
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onPress={handleUpdateEmail} color="secondary" fullWidth>Salva Email</Button>
                    <Button onPress={handleResetPassword} variant="bordered" color="secondary" fullWidth>Reset Password</Button>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>Le tue ricette pubblicate</CardHeader>
                <CardBody>
                    {loadingRecipes ? (
                        <Spinner label="Caricamento ricette..." />
                    ) : recipes.length === 0 ? (
                        <p className="text-gray-500">Non hai ancora pubblicato ricette.</p>
                    ) : (
                        <div className="space-y-4">
                            {recipes.map(recipe => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={recipe.imageUrl || "https://via.placeholder.com/50"}
                                            alt={recipe.title}
                                            className="w-12 h-12 rounded object-cover bg-gray-200"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{recipe.title}</p>
                                            <p className="text-xs text-gray-500">{recipe.category}</p>
                                        </div>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            setDeletingId(recipe.id);
                                            onOpen();
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Conferma Eliminazione</ModalHeader>
                    <ModalBody>
                        Sei sicuro di voler eliminare questa ricetta? L'azione è irreversibile.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>Annulla</Button>
                        <Button color="danger" onPress={handleDeleteRecipe}>Elimina</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
