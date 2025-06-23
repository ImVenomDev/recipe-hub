import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase.config";
import { addToast, Button } from "@heroui/react";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Forza aggiornamento stato
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          navigate("/");
        }
      }
      setChecking(false);
    }, 3000); // ogni 3s

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    if (auth.currentUser) {
      setResending(true);
      try {
        await sendEmailVerification(auth.currentUser);
        addToast({description:"Email di verifica inviata!", color: "success"});
      } catch (err) {
        addToast({description:"Errore durante l'invio dell'email.", color: "danger"});
        console.error(err);
      } finally {
        setResending(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Verifica la tua email</h2>
        <p className="text-gray-700 text-sm mb-4">
          Ti abbiamo inviato una mail di verifica. Clicca sul link ricevuto per attivare il tuo account.
        </p>

        <Button
          className="bg-orange-500 text-white px-4 py-2 rounded mt-2 font-medium"
          isLoading={resending}
          onClick={handleResend}
        >
          Reinvia email di verifica
        </Button>

        <p className="text-sm mt-4 text-gray-500">
          {checking ? "Controllo in corso..." : "In attesa della conferma..."}
        </p>
      </div>
    </div>
  );
}
