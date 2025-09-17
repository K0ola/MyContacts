import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import s from "./Modal.module.scss";

const Modal = ({ isOpen, title, children, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={s.overlay} onMouseDown={onClose} aria-hidden>
      <div
        className={s.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.header}>
          <h3>{title}</h3>
          <button className={s.closeBtn} onClick={onClose} aria-label="Fermer">×</button>
        </div>
        <div className={s.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
