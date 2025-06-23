import { Input } from "@heroui/react";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { db, auth } from "../../../firebase.config";
import { doc, setDoc, serverTimestamp, getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Aggiorna nome nel profilo
    await updateProfile(user, { displayName: username });

    // Calcola uid numerico
    const usersSnapshot = await getDocs(collection(db, "users"));
    const numericUid = usersSnapshot.size + 1;

    // Scrittura nel Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: numericUid,
      username,
      email: user.email,
      created_at: serverTimestamp(),
      recipes: [],
      admin: false,
    });

    // Invia email di verifica
    await sendEmailVerification(user);

    // Redirect a pagina di avviso
    navigate("/verify");

  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      setError("Questa email è già registrata.");
    } else {
      setError("Errore durante la registrazione.");
      console.error(err);
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrazione</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              id="username"
              label="Nome e Cognome"
              isRequired
              variant="bordered"
              isClearable
              minLength={6}
              autoComplete="name"
              autoFocus
              autoCorrect="off"
              spellCheck="false"
              onChange={(e) => setUsername(e.target.value)}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              onInvalid={(e) => e.currentTarget.setCustomValidity("Inserisci il tuo nome e cognome.")}
              pattern="^[a-zA-Z\s]{10,}$"
              title="Il nome e cognome devono contenere almeno 10 caratteri e solo lettere e spazi."
              className="w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci il tuo nome e cognome"
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              id="email"
              label="Email"
              isRequired
              variant="bordered"
              isClearable
              autoComplete="email"
              autoCorrect="off"
              spellCheck="true"
              onChange={(e) => setEmail(e.target.value)}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              onInvalid={(e) => e.currentTarget.setCustomValidity("Inserisci un'email valida.")}
              className="w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci la tua email"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="password"
              isRequired
              label="Password"
              variant="bordered"
              isClearable
              minLength={6}
              maxLength={20}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
              onChange={(e) => setPassword(e.target.value)}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className="w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci la tua password"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Registrati
          </button>
          <p className="mt-4 text-sm text-center">
            Hai già un account? <a href="/login" className="text-blue-600 hover:underline">Accedi</a>
          </p>
        </form>
      </div>
    </div>
  );
}
