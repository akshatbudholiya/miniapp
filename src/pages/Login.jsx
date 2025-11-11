import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Login.css'; // we'll create this next

function Login() {
  const [language, setLanguage] = useState('en');
  const [texts, setTexts] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // fetch texts from Supabase
  useEffect(() => {
    async function fetchTexts() {
      const { data, error } = await supabase
        .from('texts')
        .select('key, content')
        .eq('language', language);
      if (error) console.log(error);
      else {
        const obj = {};
        data.forEach(item => { obj[item.key] = item.content; });
        setTexts(obj);
      }
    }
    fetchTexts();
  }, [language]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      // login successful, redirect
      window.location.href = '/pricelist';
    }
  };

  return (
    <div className="login-page">
      <img className="background" src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg" alt="background" />
      <div className="login-container">
        <img className="logo" src="https://storage.123fakturera.se/public/icons/diamond.png" alt="logo" />
        <div className="language-switch">
          <img src="https://storage.123fakturere.no/public/flags/GB.png" alt="EN" onClick={() => setLanguage('en')} />
          <img src="https://storage.123fakturere.no/public/flags/SE.png" alt="SE" onClick={() => setLanguage('se')} />
        </div>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder={texts.email || 'Email'} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder={texts.password || 'Password'} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <button type="submit">{loading ? 'Loading...' : texts.login || 'Login'}</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;