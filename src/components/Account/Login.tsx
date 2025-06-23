import { Input } from "@heroui/react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      // Reindirizza se non verificato
      navigate("/verifica-email");
    } else {
      // Vai alla home se verificato
      navigate("/");
    }
  } catch (err: any) {
    setError("Credenziali errate o account inesistente.");
    console.error(err);
  }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            isRequired
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isClearable
                            variant="bordered"
                            autoComplete="email"
                            placeholder="Inserisci la tua email"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            isRequired
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isClearable
                            variant="bordered"
                            autoComplete="current-password"
                            placeholder="Inserisci la tua password"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 text-center mb-2">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Accedi
                    </button>
                    <p className="mt-4 text-sm text-center">
                        Non hai un account?
                        <a href="/register" className="ml-1 text-blue-600 hover:underline">Registrati</a>
                    </p>
                    <p className="mt-2 text-sm text-center">
                        <a href="/forgot-password" className="text-blue-600 hover:underline">Password dimenticata?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
