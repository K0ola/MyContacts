import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/authContext.jsx";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiLogIn } from "react-icons/fi";
import s from "./Auth.module.scss";

function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") await login({ email, password });
      else await register({ email, password });
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error?.response?.data?.error || "Erreur";
      setErr(msg);
    }
  };

  return (
    <section className={s.body}>
      <div className={s.card}>
        <h1 className={s.title}>{mode === "login" ? "Connexion" : "Créer un compte"}</h1>

        <div className={s.tabs}>
          <button
            className={`${s.tab} ${mode === "login" ? s.active : ""}`}
            type="button"
            onClick={() => setMode("login")}
          >
            <FiLogIn /> Se connecter
          </button>
          <button
            className={`${s.tab} ${mode === "register" ? s.active : ""}`}
            type="button"
            onClick={() => setMode("register")}
          >
            <FiUserPlus /> Inscription
          </button>
        </div>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <div className={s.group}>
            <label htmlFor="email" className={s.label}>Email</label>
            <div className={s.field}>
              <FiMail className={s.icon} aria-hidden="true" />
              <input
                id="email"
                type="email"
                required
                placeholder="johndoe@exemple.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={s.group}>
            <label htmlFor="password" className={s.label}>Mot de passe</label>
            <div className={s.field}>
              <FiLock className={s.icon} aria-hidden="true" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                required
                minLength={6}
                placeholder="***********"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={s.peek}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                title={showPw ? "Masquer" : "Afficher"}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {err && <p className={s.error}>{err}</p>}

          <button type="submit" className={s.submit} disabled={loading}>
            {loading
              ? mode === "login" ? "Connexion..." : "Inscription..."
              : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Auth;
