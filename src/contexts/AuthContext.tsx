// AuthContext.tsx
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  admin?: boolean;
  recipes?: string[];
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: userData.username || firebaseUser.displayName || "",
              admin: userData.admin,
              recipes: userData.recipes || []
            });
          } else {
            // fallback: just basic Firebase user if Firestore user doesn't exist
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
            });
          }
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
