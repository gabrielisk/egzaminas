import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import "./App.css";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function EquipmentListPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/equipment")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems(data);
      })
      .catch(() => setError("Tinklo klaida"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!items.length) return <p>Įrangos nėra.</p>;

  return (
    <>
      <ul className="cards">
        {items.map((item) => (
          <li className="card" key={item._id}>
            <Link to={`/equipment/${item._id}`}>
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.title} />
              ) : (
                <div>
                  <img src="https://placehold.co/220x200"></img>
                </div>
              )}
              <h4>{item.title}</h4>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
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
      {error && <div className="error">{error}</div>}
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
      {error && <div className="error">{error}</div>}
      <button type="submit">Registruotis</button>
    </form>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="main">
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
