import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <div className="nav-left">
        <div>
          <NavLink to="/equipment">Sąrašas</NavLink>
          <NavLink to="/reservations">Mano rezervacijos</NavLink>
          {user?.isAdmin && <NavLink to="/admin/iranga">Admin</NavLink>}
          {user?.isAdmin && (
            <NavLink to="/admin/rezervacijos">Admin rezervacijos</NavLink>
          )}
        </div>
        <Link to="/equipment">
          <h1>Įranga.lt</h1>
        </Link>
        <div className="nav-right">
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={logout}>Atsijungti</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Prisijungti</NavLink>
              <NavLink to="/signup">Registracija</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
