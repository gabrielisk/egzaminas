import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
  useParams,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import "./App.css";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/equipment" replace />;
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
  const { id } = useParams();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    setError("");
    setSuccess("");
    setItem(null);

    fetch(`/api/equipment/${id}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItem(data);
      })
      .catch(() => setError("Tinklo klaida"));
  }, [id]);

  const onReserve = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        equipmentId: id,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setSuccess("Rezervacija sukurta");
        setStart("");
        setEnd("");
      })
      .catch(() => setError("Tinklo klaida"));
  };

  if (error && !item) return <p className="error">{error}</p>;
  if (!item) return null;

  return (
    <div>
      <p>
        <Link to="/equipment" className="atgal">
          Atgal
        </Link>
      </p>

      <div className="detail">
        <h2>{item.title}</h2>
        {item.images?.[0] && (
          <img className="detail-img" src={item.images[0]} alt={item.title} />
        )}
        {item.description && <p>{item.description}</p>}
        {success && <div className="success">{success}</div>}
      </div>
      <form onSubmit={onReserve}>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Rezervuoti</button>
      </form>
    </div>
  );
}
function MyReservationsPage() {
  const { user } = useAuth();
  const [rezervacijos, setRezervacijos] = useState([]);
  const [klaida, setKlaida] = useState("");
  const [sekme, setSekme] = useState("");

  useEffect(() => {
    setKlaida("");
    setSekme("");

    fetch("/api/reservations/me", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        let duomenys = {};
        try {
          duomenys = await res.json();
        } catch {}
        return { ok: res.ok, duomenys };
      })
      .then(async ({ ok, duomenys }) => {
        if (!ok) {
          setKlaida(duomenys.error || "Klaida");
          return;
        }

        const rezervacijosSuPavadinimu = await Promise.all(
          duomenys.map(async (rez) => {
            const irangosId =
              typeof rez.equipment === "string"
                ? rez.equipment
                : rez.equipment?._id;

            let irangosPavadinimas = "Įranga";
            if (irangosId) {
              try {
                const ats = await fetch(`/api/equipment/${irangosId}`);
                const iranga = await ats.json();
                if (ats.ok && iranga?.title) irangosPavadinimas = iranga.title;
              } catch {}
            }

            return {
              ...rez,
              irangosPavadinimas,
              naujaPradzia: iLaikoIvesti(rez.start),
              naujaPabaiga: iLaikoIvesti(rez.end),
            };
          })
        );

        setRezervacijos(rezervacijosSuPavadinimu);
      })
      .catch(() => setKlaida("Tinklo klaida"));
  }, [user]);

  function iLaikoIvesti(isoTekstas) {
    const d = new Date(isoTekstas);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
      d.getHours()
    )}:${p(d.getMinutes())}`;
  }

  function rastiRezervacijaPagalId(sarasas, id) {
    for (const item of sarasas) if (item._id === id) return item;
    return null;
  }

  function keistiLauka(rezervacijosId, laukas, reiksme) {
    setRezervacijos((dabartinis) =>
      dabartinis.map((item) =>
        item._id === rezervacijosId ? { ...item, [laukas]: reiksme } : item
      )
    );
  }

  function atnaujintiRezervacija(rezervacijosId) {
    setKlaida("");
    setSekme("");

    const pasirinkta = rastiRezervacijaPagalId(rezervacijos, rezervacijosId);
    if (!pasirinkta) return;

    fetch(`/api/reservations/${rezervacijosId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        start: new Date(pasirinkta.naujaPradzia).toISOString(),
        end: new Date(pasirinkta.naujaPabaiga).toISOString(),
      }),
    })
      .then(async (res) => {
        let duomenys = {};
        try {
          duomenys = await res.json();
        } catch {}
        return { ok: res.ok, duomenys };
      })
      .then(({ ok, duomenys }) => {
        if (!ok) {
          setKlaida(duomenys.error || "Klaida");
          return;
        }
        setSekme("Rezervacija atnaujinta");

        setRezervacijos((dabartinis) =>
          dabartinis.map((item) =>
            item._id === rezervacijosId
              ? {
                  ...item,
                  start: duomenys.start,
                  end: duomenys.end,
                  naujaPradzia: iLaikoIvesti(duomenys.start),
                  naujaPabaiga: iLaikoIvesti(duomenys.end),
                }
              : item
          )
        );
      })
      .catch(() => setKlaida("Tinklo klaida"));
  }

  function atsauktiRezervacija(rezervacijosId) {
    setKlaida("");
    setSekme("");

    fetch(`/api/reservations/${rezervacijosId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        let duomenys = {};
        try {
          duomenys = await res.json();
        } catch {}
        return { ok: res.ok, duomenys };
      })
      .then(({ ok, duomenys }) => {
        if (!ok) {
          setKlaida(duomenys.error || "Klaida");
          return;
        }
        setSekme("Rezervacija atšaukta");
        setRezervacijos((dabartinis) =>
          dabartinis.filter((item) => item._id !== rezervacijosId)
        );
      })
      .catch(() => setKlaida("Tinklo klaida"));
  }

  return (
    <div>
      <h2>Mano rezervacijos</h2>
      {klaida && <div className="error">{klaida}</div>}
      {sekme && <div className="success">{sekme}</div>}

      {rezervacijos.length === 0 ? (
        <p>Rezervacijų nėra.</p>
      ) : (
        <ul className="rezervaciju-sarasas">
          {rezervacijos.map((item) => (
            <li key={item._id}>
              <div>
                <div>Įranga: {item.irangosPavadinimas}</div>
                <div>Nuo: {new Date(item.start).toLocaleString("lt-LT")}</div>
                <div>Iki: {new Date(item.end).toLocaleString("lt-LT")}</div>
                <div>Statusas: {item.status}</div>
              </div>

              <div className="edit-line">
                <input
                  type="datetime-local"
                  value={item.naujaPradzia}
                  onChange={(e) =>
                    keistiLauka(item._id, "naujaPradzia", e.target.value)
                  }
                />
                <input
                  type="datetime-local"
                  value={item.naujaPabaiga}
                  onChange={(e) =>
                    keistiLauka(item._id, "naujaPabaiga", e.target.value)
                  }
                />
                <button
                  className="update"
                  onClick={() => atnaujintiRezervacija(item._id)}
                >
                  Atnaujinti
                </button>
              </div>

              <button
                className="cancel"
                onClick={() => atsauktiRezervacija(item._id)}
              >
                Atšaukti
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AdminEquipmentPage() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newStatus, setNewStatus] = useState("Juodraštis");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    setError("");
    setSuccess("");
    fetch("/api/equipment-admin", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems(data);
      })
      .catch(() => setError("Tinklo klaida"));
  }, [user]);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function onCreate(e) {
    e.preventDefault();
    clearMessages();

    const body = {
      title: newTitle,
      description: newDescription,
      images: newImage ? [newImage] : [],
      status: newStatus,
    };

    fetch("/api/equipment-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems((cur) => [data, ...cur]);
        setSuccess("Įranga sukurta");
        setNewTitle("");
        setNewDescription("");
        setNewImage("");
        setNewStatus("Juodraštis");
      })
      .catch(() => setError("Tinklo klaida"));
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    setEditImage(item.images?.[0] || "");
    setSuccess("");
    setError("");
  }

  function saveEdit(id) {
    clearMessages();
    const body = {
      title: editTitle,
      description: editDescription,
      images: editImage ? [editImage] : [],
    };
    fetch(`/api/equipment-admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        images: editImage.trim() ? [editImage.trim()] : [],
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems((cur) => cur.map((x) => (x._id === id ? data : x)));
        setEditingId(null);
        setSuccess("Įranga atnaujinta");
      })
      .catch(() => setError("Tinklo klaida"));
  }

  function removeItem(id) {
    clearMessages();
    fetch(`/api/equipment-admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems((cur) => cur.filter((x) => x._id !== id));
        setSuccess("Įranga ištrinta");
      })
      .catch(() => setError("Tinklo klaida"));
  }

  function toggleStatus(item) {
    clearMessages();
    const naujaBusena =
      item.status === "Paskelbta" ? "Juodraštis" : "Paskelbta";
    fetch(`/api/equipment-admin/${item._id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: naujaBusena }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems((cur) => cur.map((x) => (x._id === item._id ? data : x)));
        setSuccess(`Būsena pakeista: ${naujaBusena}`);
      })
      .catch(() => setError("Tinklo klaida"));
  }

  return (
    <div className="admin">
      <h2>Admin: Įranga</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={onCreate}>
        <h3>Sukurti įrangą</h3>
        <input
          placeholder="Pavadinimas"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <input
          placeholder="Aprašymas"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          placeholder="Nuotraukos URL"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option>Juodraštis</option>
          <option>Paskelbta</option>
        </select>
        <button type="submit">Sukurti</button>
      </form>

      <ul className="admin-list">
        {items.map((iranga) => (
          <li className="admin-item" key={iranga._id}>
            {editingId === iranga._id ? (
              <div className="admin-item-main">
                <input
                  placeholder="Pavadinimas"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  placeholder="Aprašymas"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <input
                  placeholder="Nuotraukos URL"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                />
              </div>
            ) : (
              <div className="admin-item-main">
                <strong>{iranga.title}</strong>
                <p>{iranga.description}</p>
                <div
                  className={`badge ${
                    iranga.status === "Paskelbta"
                      ? "badge-paskelbta"
                      : "badge-juodrastis"
                  }`}
                >
                  {iranga.status}
                </div>
                {iranga.images?.[0] && <small>{iranga.images[0]}</small>}
              </div>
            )}

            <div className="admin-actions">
              {editingId === iranga._id ? (
                <>
                  <button
                    className="btn-redaguoti"
                    onClick={() => saveEdit(iranga._id)}
                  >
                    Išsaugoti
                  </button>
                  <button
                    className="btn-juodrastis"
                    onClick={() => setEditingId(null)}
                  >
                    Atšaukti
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-redaguoti"
                    onClick={() => startEdit(iranga)}
                  >
                    Redaguoti
                  </button>
                  <button
                    className="btn-istrinti"
                    onClick={() => removeItem(iranga._id)}
                  >
                    Ištrinti
                  </button>
                  <button
                    className="btn-juodrastis"
                    onClick={() => toggleStatus(iranga)}
                  >
                    {iranga.status === "Paskelbta"
                      ? "Padaryti juodraščiu"
                      : "Paskelbti"}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminReservationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setError("");
    setSuccess("");

    Promise.all([
      fetch("/api/reservations-admin", {
        headers: { Authorization: `Bearer ${user.token}` },
      }).then((res) => res.json().then((data) => ({ ok: res.ok, data }))),

      fetch("/api/equipment-admin", {
        headers: { Authorization: `Bearer ${user.token}` },
      }).then((res) => res.json().then((data) => ({ ok: res.ok, data }))),
    ])
      .then(([rez, eq]) => {
        if (!rez.ok) {
          setError(rez.data.error || "Klaida");
          return;
        }
        if (!eq.ok) {
          setError(eq.data.error || "Klaida (įrangos sąrašas)");
          return;
        }

        const titleById = {};
        eq.data.forEach((iranga) => {
          titleById[iranga._id] = iranga.title;
        });

        const suPavadinimais = rez.data.map((rez) => {
          const equipmentId =
            typeof rez.equipment === "string"
              ? rez.equipment
              : rez.equipment?._id;

          const irangosPavadinimas =
            titleById[equipmentId] || "(Įranga nerasta)";
          return { ...rez, irangosPavadinimas, naujasStatusas: rez.status };
        });

        setItems(suPavadinimais);
      })
      .catch(() => setError("Tinklo klaida"));
  }, [user]);

  function keistiLauka(rezId, reiksme) {
    setItems((cur) =>
      cur.map((r) => (r._id === rezId ? { ...r, naujasStatusas: reiksme } : r))
    );
  }

  function issaugotiStatusa(rezId) {
    setError("");
    setSuccess("");
    const pasirinkta = items.find((r) => r._id === rezId);
    if (!pasirinkta) return;

    fetch(`/api/reservations-admin/${rezId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: pasirinkta.naujasStatusas }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || "Klaida");
          return;
        }
        setItems((cur) =>
          cur.map((r) => (r._id === rezId ? { ...r, status: data.status } : r))
        );
        setSuccess("Statusas atnaujintas");
      })
      .catch(() => setError("Tinklo klaida"));
  }

  return (
    <div>
      <h2>Admin: Rezervacijos</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <ul className="admin-list">
        {items.map((rez) => (
          <li className="admin-item" key={rez._id}>
            <div className="admin-item-main">
              <strong>{rez.irangosPavadinimas}</strong>
              <div>Nuo: {new Date(rez.start).toLocaleString("lt-LT")}</div>
              <div>Iki: {new Date(rez.end).toLocaleString("lt-LT")}</div>
              <div>Dabartinis: {rez.status}</div>
            </div>
            <div className="admin-actions">
              <select
                value={rez.naujasStatusas}
                onChange={(e) => keistiLauka(rez._id, e.target.value)}
              >
                <option>Laukiama</option>
                <option>Patvirtinta</option>
                <option>Vykdoma</option>
                <option>Atmesta</option>
              </select>
              <button
                className="btn-redaguoti"
                onClick={() => issaugotiStatusa(rez._id)}
              >
                Išsaugoti
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
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
      login({ email: data.email, token: data.token, isAdmin: data.isAdmin });
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
      login({ email: data.email, token: data.token, isAdmin: data.isAdmin });
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
            <Route
              path="/admin/iranga"
              element={
                <Protected>
                  <AdminOnly>
                    <AdminEquipmentPage />
                  </AdminOnly>
                </Protected>
              }
            />
            <Route
              path="/admin/rezervacijos"
              element={
                <Protected>
                  <AdminOnly>
                    <AdminReservationsPage />
                  </AdminOnly>
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
