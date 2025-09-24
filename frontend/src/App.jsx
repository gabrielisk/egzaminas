import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useState } from "react";
import "./App.css";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function EquipmentListPage() {
  return <div>Įrangos sąrašas </div>;
}
function EquipmentDetailPage() {
  return <div>Įrangos detalė </div>;
}
function MyReservationsPage() {
  return <div>Mano rezervacijos </div>;
}

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Klaida");
        return;
      }
      login({ email: data.email, token: data.token });
      nav("/equipment");
    } catch {
      setError("Tinklo klaida");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Prisijungti</h3>
      <input
        placeholder="El. paštas"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Slaptažodis"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Prisijungti</button>
    </form>
  );
}

function SignupPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Klaida");
        return;
      }
      login({ email: data.email, token: data.token });
      nav("/equipment");
    } catch {
      setError("Tinklo klaida");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Registracija</h3>
      <input
        type="email"
        placeholder="El. paštas"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Slaptažodis"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Registruotis</button>
    </form>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/equipment"
              element={
                <Protected>
                  <EquipmentListPage />
                </Protected>
              }
            />
            <Route
              path="/equipment/:id"
              element={
                <Protected>
                  <EquipmentDetailPage />
                </Protected>
              }
            />
            <Route
              path="/reservations"
              element={
                <Protected>
                  <MyReservationsPage />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/equipment" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
