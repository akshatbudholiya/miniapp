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
      } else {
        console.error("Error fetching translations:", error);
        setTexts({}); 
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

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg(texts.required_fields || "Please enter email and password");
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
        setErrorMsg(data.message || (texts.invalid_credentials || "Invalid credentials"));
      } else {
        localStorage.setItem("jwt-token", data.token);
        navigate("/pricelist");
      }
    } catch (err) {
      setErrorMsg(texts.server_error || "Server error. Try again later.");
    }
  };

  const closeMenuAndNavigate = (path) => {
    setMenuOpen(false);
    setTimeout(() => navigate(path), 80);
  };

  const toggleLanguage = () => {
    setLanguage((l) => (l === "en" ? "se" : "en"));
  };

  const currentFlag = language === "en" 
    ? "https://storage.123fakturere.no/public/flags/GB.png" 
    : "https://storage.123fakturere.no/public/flags/SE.png";
  
  const mobileSwitchFlag = language === "en" 
    ? "https://storage.123fakturere.no/public/flags/SE.png"
    : "https://storage.123fakturere.no/public/flags/GB.png";

  return (
    <div className="login-page">
      <nav className="terms-nav" role="navigation" aria-label="Main navigation">
        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          alt="Logo"
          className="nav-logo"
        />
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

        <div className="desktop-menu">
          <a onClick={() => navigate("/")}>{texts.home || "Home"}</a>
          <a onClick={() => navigate("/pricelist")}>{texts.pricelist || "Price List"}</a>
          <a onClick={() => navigate("/terms")}>{texts.terms || "Terms"}</a>
        </div>


        <div className="nav-right-container">
          <span className="lang-text">{language === "en" ? "English" : "Svenska"}</span>
          <button
            className="lang-select"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <img src={currentFlag} alt={language === "en" ? "English" : "Swedish"} />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside className={`mobile-menu ${menuOpen ? "show" : ""}`} aria-hidden={!menuOpen}>
        <a onClick={() => closeMenuAndNavigate("/")}>{texts.home || "Home"}</a>
        <a onClick={() => closeMenuAndNavigate("/pricelist")}>{texts.pricelist || "Price List"}</a>
        <a onClick={() => closeMenuAndNavigate("/terms")}>{texts.terms || "Terms"}</a>
        
        <button
          className="mobile-lang"
          onClick={() => {
            toggleLanguage();
            setMenuOpen(false);
          }}
        >
          <img src={mobileSwitchFlag} alt="flag" style={{ width: 20 }} />
          <span>{language === "en" ? "Switch to Swedish" : "Switch to English"}</span>
        </button>
      </aside>

      <img
        src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
        alt="Background"
        className="background-image"
      />

      <div className="login-box" role="main">
        <h2 className="login-title">{texts.login || "Log in"}</h2>

        <div className="input-group">
          <label htmlFor="email-input">{texts.email_label || "Enter your email address"}</label>
          <input
            id="email-input"
            type="email"
            placeholder={texts.email_placeholder || "Email address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password-input">{texts.password_label || "Enter your password"}</label>
          <input
            id="password-input"
            type="password"
            placeholder={texts.password_placeholder || "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button className="login-btn" onClick={handleLogin}>
          {texts.login || "Log in"}
        </button>

        <div className="login-footer-links">
          <p className="register-link" onClick={() => navigate("/register")}>
            {texts.register || "Register"}
          </p>
          <p className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
            {texts.forgot_password || "Forgotten password?"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;