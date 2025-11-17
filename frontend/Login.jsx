import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have imported and configured your supabase client in this path
import { supabase } from "./src/lib/supabaseClient.js"; 
import "./Login.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [language, setLanguage] = useState("en"); 
  const [texts, setTexts] = useState({}); // Stores key/content translations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 1. EFFECT TO FETCH TEXTS: Runs when the 'language' state changes.
  useEffect(() => {
    const fetchTexts = async () => {
      const { data, error } = await supabase
        .from("texts")
        .select("key, content") 
        .eq("language", language);

      if (!error && Array.isArray(data)) {
        const dict = {};
        // Convert the array of {key, content} objects into a single dictionary
        data.forEach((row) => (dict[row.key] = row.content));
        setTexts(dict);
      } else {
        console.error("Error fetching translations:", error);
        setTexts({}); 
      }
    };
    fetchTexts();
  }, [language]); 

  // 2. EFFECT FOR MENU ESCAPE/BODY OVERFLOW 
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

  // 3. HANDLER FOR LOGIN SUBMISSION
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

  // 4. HANDLER TO TOGGLE LANGUAGE
  const toggleLanguage = () => {
    setLanguage((l) => (l === "en" ? "se" : "en"));
  };

  // Determine flag images dynamically
  const currentFlag = language === "en" 
    ? "https://storage.123fakturere.no/public/flags/GB.png" 
    : "https://storage.123fakturere.no/public/flags/SE.png";
  
  const mobileSwitchFlag = language === "en" 
    ? "https://storage.123fakturere.no/public/flags/SE.png"
    : "https://storage.123fakturere.no/public/flags/GB.png";

  return (
    <div className="login-page">
      <nav className="terms-nav" role="navigation" aria-label="Main navigation">
        {/* HAMBURGER (Left side) */}
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

        {/* LANGUAGE/FLAG (Right side) - Toggles language and triggers Supabase fetch */}
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

      {/* Mobile overlay and menu */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside className={`mobile-menu ${menuOpen ? "show" : ""}`} aria-hidden={!menuOpen}>
        {/* Navigation links using translation keys */}
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
        {/* Title using texts.login */}
        <h2 className="login-title">{texts.login || "Log in"}</h2>

        {/* INPUT GROUP 1: EMAIL */}
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

        {/* INPUT GROUP 2: PASSWORD */}
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

        {/* Button using texts.login */}
        <button className="login-btn" onClick={handleLogin}>
          {texts.login || "Log in"}
        </button>

        {/* FOOTER LINKS */}
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