import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

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
      setErrorMsg("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
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
        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          className="nav-logo"
          alt="Logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        <div className="desktop-menu nav-links" aria-hidden={menuOpen}>
          <a onClick={() => navigate("/")}>Home</a>
          <a onClick={() => navigate("/pricelist")}>Price List</a>
          <a onClick={() => navigate("/terms")}>Terms</a>

          <button
            className="lang-select"
            onClick={() => setLanguage((l) => (l === "en" ? "se" : "en"))}
            aria-label="Toggle language"
          >
            <img
              src={
                language === "en"
                  ? "https://storage.123fakturere.no/public/flags/SE.png"
                  : "https://storage.123fakturere.no/public/flags/GB.png"
              }
              alt={language === "en" ? "Swedish" : "English"}
            />
            <span className="lang-code">{language === "en" ? "SE" : "EN"}</span>
          </button>
        </div>

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
      </nav>

      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <aside className={`mobile-menu ${menuOpen ? "show" : ""}`} aria-hidden={!menuOpen}>
        <a onClick={() => closeMenuAndNavigate("/")}>Home</a>
        <a onClick={() => closeMenuAndNavigate("/pricelist")}>Price List</a>
        <a onClick={() => closeMenuAndNavigate("/terms")}>Terms</a>

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
        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          alt="Logo"
          className="logo"
        />

        <h2>{texts.login}</h2>

        <input
          type="email"
          placeholder={texts.email || "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />

        <input
          type="password"
          placeholder={texts.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />

        <button className="login-btn" onClick={handleLogin}>
          {texts.login || "Login"}
        </button>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <p
          className="terms-link"
          onClick={() => navigate("/terms")}
          style={{ cursor: "pointer", marginTop: "15px", textDecoration: "underline" }}
        >
          {texts.terms || "Terms & Conditions"}
        </p>
      </div>
    </div>
  );
}

export default Login;
