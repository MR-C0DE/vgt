import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import styles from "./stylesheets/ThanksContributions.module.css";
import { getBrowserId } from "./utils/browserId";

const ThanksParticipants = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [list, setList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const browserId = getBrowserId();

  const fetchList = async () => {
    try {
      const res = await fetch("/api/participants", {
        headers: { "x-browser-id": browserId },
      });
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || adults === "" || children === "") {
      setError("All fields are required");
      return;
    }
    if (adults < 0 || children < 0) {
      setError("Adults and children must be >= 0");
      return;
    }
    setError("");

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? {
          id: editingId,
          newName: name,
          newAdults: Number(adults),
          newChildren: Number(children),
        }
      : { name, adults: Number(adults), children: Number(children) };

    try {
      const res = await fetch("/api/participants", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-browser-id": browserId,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      const newItem = await res.json();

      if (editingId) {
        setList(list.map((item) => (item.id === editingId ? newItem : item)));
        setEditingId(null);
      } else {
        setList([newItem, ...list]);
      }

      setName("");
      setAdults("");
      setChildren("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/participants?id=${id}`, {
        method: "DELETE",
        headers: { "x-browser-id": browserId },
      });
      if (res.status === 403) {
        setError("You cannot delete this item from another browser");
        return;
      }
      setList(list.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Something went wrong while deleting.");
    }
  };

  const handleEdit = (item) => {
    if (item.browserId !== browserId) {
      setError("You cannot edit this item from another browser");
      return;
    }
    setEditingId(item.id);
    setName(item.name);
    setAdults(item.adults);
    setChildren(item.children);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setAdults("");
    setChildren("");
    setError("");
  };

  return (
    <div className={styles.container}>
      <h3>{t("event.display.participantsTitle")}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>{t("event.display.nameLabel")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>{t("event.display.adultsLabel")}</label>
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>
        <div>
          <label>{t("event.display.childrenLabel")}</label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit">
            {editingId
              ? t("event.display.updateParticipant")
              : t("event.display.addParticipant")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancel}
            >
              {t("event.display.cancel")}
            </button>
          )}
        </div>
      </form>

      <button
        className={styles.toggleListBtn}
        onClick={() => setShowList(!showList)}
      >
        {showList
          ? t("event.display.hideParticipantsList")
          : t("event.display.showParticipantsList")}
      </button>

      {showList && (
        <>
          {list.length === 0 ? (
            <p>{t("event.display.noParticipants")}</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("event.display.nameColumn")}</th>
                  <th>{t("event.display.adultsColumn")}</th>
                  <th>{t("event.display.childrenColumn")}</th>
                  <th>{t("event.display.actionColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.adults}</td>
                    <td>{item.children}</td>
                    <td>
                      {item.browserId === browserId ? (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className={styles.edit}
                          >
                            {t("event.display.edit")}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={styles.delete}
                          >
                            {t("event.display.delete")}
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "gray" }}>Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ThanksParticipants;
