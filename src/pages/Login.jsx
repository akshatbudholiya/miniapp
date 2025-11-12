import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

function Login() {
  const [language, setLanguage] = useState("en"); // en or se
  const [texts, setTexts] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Fetch texts from Supabase texts table
  useEffect(() => {
    const fetchTexts = async () => {
      const { data, error } = await supabase
        .from("texts")
        .select("key, content")
        .eq("language", language);

      if (error) {
        console.error("Error fetching texts:", error);
      } else {
        const dict = {};
        data.forEach((row) => {
          dict[row.key] = row.content;
        });
        setTexts(dict);
      }
    };

    fetchTexts();
  }, [language]);

  // Handle login via backend server
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
        setErrorMsg(data.message);
      } else {
        // Store JWT token in localStorage
        localStorage.setItem("jwt-token", data.token);
        // Redirect to pricelist page
        navigate("/pricelist");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
        alt="Background"
        className="background-image"
      />

      <div className="login-box">
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
        />

        <input
          type="password"
          placeholder={texts.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          {texts.login || "Login"}
        </button>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {/* Language toggle */}
        <img
          src={
            language === "en"
              ? "https://storage.123fakturere.no/public/flags/SE.png"
              : "https://storage.123fakturere.no/public/flags/GB.png"
          }
          alt="Flag"
          className="flag"
          onClick={() => setLanguage(language === "en" ? "se" : "en")}
          style={{ cursor: "pointer", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

export default Login;
