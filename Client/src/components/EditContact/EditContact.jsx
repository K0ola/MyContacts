import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./EditContact.module.scss";

const EditContact = ({ isOpen, onClose, onSubmit, contact }) => {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (contact) {
      const fullName =
        (contact.firstName ? contact.firstName : "") +
        (contact.lastName ? ` ${contact.lastName}` : "");
      setForm({
        name: fullName.trim() || contact.name || "",
        phone: contact.phone ?? "",
      });
    } else {
      setForm({ name: "", phone: "" });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
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
      setError('Merci d’indiquer "Prénom Nom" (ex: John Doe).');
      return;
    }

    setError("");

    const updated = {
      _id: contact?._id,
      firstName,
      lastName,
      phone,
    };

    onSubmit?.(updated); 
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le contact">
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Nom* (Prénom + Nom)
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
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

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditContact;
