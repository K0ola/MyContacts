import React from "react";
import { useAuth } from "../../utils/authContext.jsx";

import s from "./Header.module.scss";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={s.header}>
      <div className={s.title}>MyContacts</div>
      <div className={s.actions}>
        {/* {user?.email && <span>{user.email}</span>} */}
        <button onClick={logout}>Se déconnecter</button>
      </div>
    </header>
  );
}

export default Header;