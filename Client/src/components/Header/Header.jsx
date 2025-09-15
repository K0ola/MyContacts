import React from "react";

import s from "./Header.module.scss";

function Header() {
    return (
        <header className={s.header}>
            <h1 className={s.title}>MyContacts</h1>
        </header>
    )
}

export default Header; 