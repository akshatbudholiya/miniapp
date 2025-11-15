import React, { useState, useEffect } from "react";
import "./Terms.css";

const TermsPage = () => {
  const [lang, setLang] = useState("en");
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/terms/${lang}`);
        if (!response.ok) throw new Error("Failed to load terms");
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTerms();
  }, [lang]);

  const goBack = () => window.history.back();

  return (
    <div className="terms-page">
      <header className="terms-nav">
        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          alt="Logo"
          className="nav-logo"
        />

        <nav className="nav-links desktop-menu">
          <a href="/">Home</a>
          <a href="/order">Order</a>
          <a href="/customers">Our Customers</a>
          <a href="/about">About us</a>
          <a href="/contact">Contact Us</a>

          <button className="lang-select" onClick={() => setLang(lang === "en" ? "sv" : "en")}>
            {lang === "en" ? (
              <>
                English <img src="https://storage.123fakturere.no/public/flags/GB.png" alt="English" />
              </>
            ) : (
              <>
                Svenska <img src="https://storage.123fakturere.no/public/flags/SE.png" alt="Swedish" />
              </>
            )}
          </button>
        </nav>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </button>

        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/order" onClick={() => setMenuOpen(false)}>Order</a>
          <a href="/customers" onClick={() => setMenuOpen(false)}>Our Customers</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About us</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</a>

          <button
            className="lang-select mobile-lang"
            onClick={() => {
              setLang(lang === "en" ? "sv" : "en");
              setMenuOpen(false);
            }}
          >
            {lang === "en" ? (
              <>
                English <img src="https://storage.123fakturere.no/public/flags/GB.png" alt="English" />
              </>
            ) : (
              <>
                Svenska <img src="https://storage.123fakturere.no/public/flags/SE.png" alt="Swedish" />
              </>
            )}
          </button>
        </div>
      </header>

      <main className="terms-content-wrapper">
        <h1 className="terms-title">Terms</h1>

        <button className="go-back-btn" onClick={goBack}>Close and Go Back</button>

        <section className="terms-text-container">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <div
              className="terms-text"
              dangerouslySetInnerHTML={{ __html: terms?.content }}
            />
          )}
        </section>

      </main>
    </div>
  );
};

export default TermsPage;