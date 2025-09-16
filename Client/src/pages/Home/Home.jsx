import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import s from "./Home.module.scss";

import { FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import AddContact from "../../components/AddContact/AddContact";
import EditContact from "../../components/EditContact/EditContact";
import { ContactsAPI } from "../../utils/api";

function Home() {
  const [contacts, setContacts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");

  const loadContacts = async () => {
    setErr("");
    try {
      const { data } = await ContactsAPI.list({ sort: "lastName:asc" });
      setContacts(data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const openEdit = (c) => {
    setSelected(c);
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setSelected(null);
    setIsEditOpen(false);
  };

  const handleAdd = async (payload) => {
    const { data } = await ContactsAPI.create(payload);
    setContacts((list) => [data, ...list]);
  };

  const handleEdit = async (id, payload) => {
    const { data } = await ContactsAPI.update(id, payload);
    setContacts((list) => list.map((c) => (c._id === id ? data : c)));
  };

  const handleDelete = async (id) => {
    await ContactsAPI.remove(id);
    setContacts((list) => list.filter((c) => c._id !== id));
  };

  return (
    <section className={s.app}>
      <Header />

      <div className={s.container}>
        <div className={s.actionsBar}>
          <button className={s.addBtn} onClick={openAdd}>
            <FaPlus /> Ajouter un contact
          </button>
        </div>

        {err && <div className={s.error}>{err}</div>}

        <div className={s.contactsList}>
          {contacts.map((c) => (
            <div key={c._id} className={s.contact}>
              <div className={s.contactDetails}>
                <div className={s.contactIllu} />
                <div className={s.contactInfos}>
                  <h1 className={s.name}>
                    {c.firstName} {c.lastName}
                  </h1>
                  <h2 className={s.phoneNumber}>{c.phone}</h2>
                </div>
              </div>

              <div className={s.actions}>
                <button
                  onClick={() => openEdit(c)}
                  className={s.EditBTN}
                  aria-label={`Modifier ${c.firstName} ${c.lastName}`}
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className={s.DeleteBTN}
                  aria-label={`Supprimer ${c.firstName} ${c.lastName}`}
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {contacts.length === 0 && !err && <div>Aucun contact pour le moment.</div>}
        </div>
      </div>

      <AddContact
        isOpen={isAddOpen}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />

      <EditContact
        isOpen={isEditOpen}
        onClose={closeEdit}
        onSubmit={(updated) => handleEdit(updated._id, updated)}
        contact={selected}
      />
    </section>
  );
}

export default Home;
