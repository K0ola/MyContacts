import React, { useState } from "react";
import Modal from "../Modal/Modal";
import s from "./AddContact.module.scss";

const initial = { name: "", phone: "" };

const AddContact = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name || !phone) {
      setError("Nom et téléphone sont requis.");
      return;
    }

    const parts = name.split(/\s+/);
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ") || "";

    if (!firstName || !lastName) {
      setError("Merci d’indiquer prénom et nom (ex: \"John Doe\").");
      return;
    }

    setError("");

    try {
      await onSubmit?.({ firstName, lastName, phone });
      setForm(initial);
      onClose?.();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur";
      setError(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un contact">
      <form className={s.form} onSubmit={handleSubmit}>
        <label>
          Nom* (Prénom + Nom)
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="off"
          />
        </label>

        <label>
          Téléphone*
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+336..."
            autoComplete="tel"
          />
        </label>

        {error && <p className={s.error}>{error}</p>}

        <div className={s.actions}>
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit">Ajouter</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContact;
