// AuthContext.tsx
import {
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
    type User as FirebaseUser,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";

export interface AppUser {
    updateProfile(arg0: { displayName: string; }): unknown;
    updateEmail(email: string): unknown;
    uid: string;
    email: string;
    displayName: string;
    admin?: boolean;
    recipes?: string[];
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    reloadUser: () => Promise<void>;
    updateDisplayName: (newName: string) => Promise<void>;
    updateEmailAddress: (newEmail: string) => Promise<void>;
    resetPassword: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    reloadUser: async () => {},
    updateDisplayName: async () => {},
    updateEmailAddress: async () => {},
    resetPassword: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (firebaseUser: FirebaseUser) => {
        try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: userData.displayName || firebaseUser.displayName || "",
                    admin: userData.admin,
                    recipes: userData.recipes || [],
                    updateProfile: (args: { displayName: string }) => updateProfile(firebaseUser, args),
                    updateEmail: (email: string) => updateEmail(firebaseUser, email),
                });
            }
        } catch (error) {
            console.error("Errore nel recupero dei dati utente:", error);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchUserData(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchUserData]);

    const reloadUser = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.reload();
            await fetchUserData(currentUser);
        }
    }, [fetchUserData]);

    const updateDisplayName = useCallback(async (newName: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await updateProfile(currentUser, { displayName: newName });
            await reloadUser();
        }
    }, [reloadUser]);

    const updateEmailAddress = useCallback(async (newEmail: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await updateEmail(currentUser, newEmail);
            await reloadUser();
        }
    }, [reloadUser]);

    const resetPassword = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.email) {
            await sendPasswordResetEmail(auth, currentUser.email);
        } else {
            throw new Error("Email utente non disponibile per il reset.");
        }
    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                reloadUser,
                updateDisplayName,
                updateEmailAddress,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
