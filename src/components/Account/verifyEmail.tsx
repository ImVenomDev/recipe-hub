// VerifyEmail.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase.config";
import { addToast, Button, Spinner } from "@heroui/react";
import {
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [writing, setWriting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;

      await user.reload();
      const refreshed = auth.currentUser;

      if (refreshed?.emailVerified && !writing) {
        setVerified(true);
        setWriting(true);

        try {
            const docRef = doc(db, "users", refreshed.uid);
            const exists = await getDoc(docRef);

            if (!exists.exists()) {
                const allUsers = await getDocs(collection(db, "users"));
                const numericUid = allUsers.size + 1;

                await updateProfile(refreshed, {
                    displayName: refreshed.displayName || "Utente",
                });

                await setDoc(docRef, {
                    uid: numericUid,
                    username: refreshed.displayName,
                    email: refreshed.email,
                    created_at: serverTimestamp(),
                    recipes: [],
                    admin: false,
                });
        }
            addToast({ description: "Registrazione completata con successo!", color: "success" });

            // logout e redirect al login
            await auth.signOut();
            clearInterval(interval);
            navigate("/login");

        } catch (err) {
          console.error(err);
          setWriting(false);
          addToast({
            description: "Errore durante il salvataggio dell'utente.",
            color: "danger",
          });
        }
      }

      setChecking(false);
      
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, writing]);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setResending(true);
    try {
      await sendEmailVerification(user);
      addToast({ description: "Email di verifica inviata!", color: "success" });
    } catch (err) {
      console.error(err);
      addToast({ description: "Errore durante l'invio.", color: "danger" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 transition-all duration-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-purple-700 mb-3">Verifica la tua email</h2>
        <p className="text-sm text-gray-700 mb-6">
          Ti abbiamo inviato una mail di verifica. Clicca il link per completare l'attivazione.
        </p>

        {verified ? (
          <p className="text-green-600 font-semibold">Email verificata! Reindirizzamento...</p>
        ) : (
          <>
            <Button
              onPress={handleResend}
              isLoading={resending}
              disabled={resending || !auth.currentUser}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-2 font-medium"
            >
              Reinvia email
            </Button>
            <p className="text-sm mt-4 text-gray-500 flex justify-center items-center gap-2">
              {checking ? <Spinner size="sm" /> : "In attesa della verifica..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
