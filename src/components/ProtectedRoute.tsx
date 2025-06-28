import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "@heroui/react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center mt-10"><Spinner label="Verifica stato utente…" /></div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center mt-10"><Spinner label="Verifica stato utente…" /></div>;
    return user && user.admin ? <>{children}</> : <Navigate to="/" replace />;
}

export { ProtectedRoute, AdminRoute };