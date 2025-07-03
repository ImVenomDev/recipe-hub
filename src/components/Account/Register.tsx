import { Input, Button, Spinner } from "@heroui/react";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);


      // Redirect all'avviso con messaggio
      navigate("/verify", { state: { emailSent: true } });
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Questa email è già registrata.");
      } else if (err.code === "auth/weak-password") {
        setError("La password è troppo debole.");
      } else {
        setError("Errore durante la registrazione.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Crea un account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Username"
            isRequired
            variant="bordered"
            isClearable
            minLength={6}
            autoComplete="name"
            pattern="^{6,}$"
            title="Inserisci almeno 6 caratteri"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <Input
            type="email"
            label="Email"
            isRequired
            variant="bordered"
            isClearable
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esempio@email.com"
          />

          <Input
            type="password"
            label="Password"
            isRequired
            variant="bordered"
            isClearable
            minLength={6}
            maxLength={20}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button
            type="submit"
            color="primary"
            fullWidth
            className="font-semibold"
            isDisabled={loading}
          >
            {loading ? <Spinner size="sm" color="white" /> : "Registrati"}
          </Button>

          <p className="mt-4 text-sm text-center">
            Hai già un account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Accedi
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
