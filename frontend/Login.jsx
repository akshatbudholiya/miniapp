import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./src/lib/supabaseClient.js";
import "./Login.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [language, setLanguage] = useState("en");
  const [texts, setTexts] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- Omitted useEffects for brevity (they remain unchanged) ---
  useEffect(() => {
    const fetchTexts = async () => {
      const { data, error } = await supabase
        .from("texts")
        .select("key, content")
        .eq("language", language);

      if (!error && Array.isArray(data)) {
        const dict = {};
        data.forEach((row) => (dict[row.key] = row.content));
        setTexts(dict);
      }
    };
    fetchTexts();
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  // --- End Omitted useEffects ---

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid credentials");
      } else {
        localStorage.setItem("jwt-token", data.token);
        navigate("/pricelist");
      }
    } catch (err) {
      setErrorMsg("Server error. Try again later.");
    }
  };

  const closeMenuAndNavigate = (path) => {
    setMenuOpen(false);
    setTimeout(() => navigate(path), 80);
  };

  return (
    <div className="login-page">
      <nav className="terms-nav" role="navigation" aria-label="Main navigation">
        {/* HAMBURGER MOVED TO THE LEFT */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
        </button>

        {/* LOGO REMOVED FROM NAVBAR - Desktop menu and mobile menu remain hidden/visible by CSS */}
        {/* Desktop and Mobile language switch is consolidated and aligned right for mobile view */}
        <div className="nav-right-container">
          <span className="lang-text">{language === "en" ? "English" : "Svenska"}</span>
          <button
            className="lang-select"
            onClick={() => setLanguage((l) => (l === "en" ? "se" : "en"))}
            aria-label="Toggle language"
          >
            <img
              src={
                language === "en"
                  ? "https://storage.123fakturere.no/public/flags/GB.png"
                  : "https://storage.123fakturere.no/public/flags/SE.png"
              }
              alt={language === "en" ? "English" : "Swedish"}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay and menu remain unchanged */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside className={`mobile-menu ${menuOpen ? "show" : ""}`} aria-hidden={!menuOpen}>
        <a onClick={() => closeMenuAndNavigate("/")}>Home</a>
        <a onClick={() => closeMenuAndNavigate("/pricelist")}>Price List</a>
        <a onClick={() => closeMenuAndNavigate("/terms")}>Terms</a>
        {/* Simplified mobile language switch for this demo */}
        <button
          className="mobile-lang"
          onClick={() => {
            setLanguage((l) => (l === "en" ? "se" : "en"));
            setMenuOpen(false);
          }}
        >
          <img
            src={
              language === "en"
                ? "https://storage.123fakturere.no/public/flags/SE.png"
                : "https://storage.123fakturere.no/public/flags/GB.png"
            }
            alt="flag"
            style={{ width: 20 }}
          />
          <span>{language === "en" ? "Switch to Swedish" : "Switch to English"}</span>
        </button>
      </aside>

      <img
        src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
        alt="Background"
        className="background-image"
      />

      <div className="login-box" role="main">
        {/* REMOVED LOGO: <img src="..." className="logo" /> */}

        <h2 className="login-title">Log in</h2> {/* Custom class for styling */}

        <div className="input-group">
          <label htmlFor="email-input">Enter your email address</label>
          <input
            id="email-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password-input">Enter your password</label>
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          {/* Eye icon for password visibility is a styling/UI detail, kept simple here */}
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Log in
        </button>

        <div className="login-footer-links">
          <p className="register-link" onClick={() => navigate("/register")}>
            Register
          </p>
          <p className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
            Forgotten password?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;