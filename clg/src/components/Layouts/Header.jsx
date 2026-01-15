import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { toast } from "react-hot-toast";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
  try {
    const userId = auth?.user?._id;
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    localStorage.removeItem("auth");
    localStorage.removeItem("cart"); // safe fallback

    setAuth({ user: null, token: "" });
    if (typeof setCart === "function") setCart([]);

    toast.success("Logged out successfully");
    navigate("/login");
  } catch (err) {
    console.error("Logout error:", err);
    toast.error("Logout failed");
  }
};


  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid px-4">
        {/* Brand name / logo */}
        <Link className="navbar-brand fw-bold text-pink" to="/">
          <i className="bi bi-calendar-heart-fill me-2"></i> CampusConnect
        </Link>

        {/* Toggle for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fw-semibold" to="/">
                Home
              </Link>
            </li>

            {!auth?.user ? (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link text-dark fw-semibold" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link text-dark fw-semibold" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-capitalize"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ border: "none" }}
                >
                  {auth?.user?.name}
                </a>
                <ul className="dropdown-menu shadow-sm">
                  <li>
                    <NavLink
                      to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    {/* use button or anchor that calls handleLogout */}
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger"
                      style={{ background: "transparent", border: "none", padding: 0, textAlign: "left", width: "100%" }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fw-semibold" to="/events">
                Events
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Badge count={cart?.length || 0} showZero>
                <NavLink to="/cart" className="nav-link">
                  Cart
                </NavLink>
              </Badge>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
