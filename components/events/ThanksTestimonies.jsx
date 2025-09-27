import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import styles from "./stylesheets/ThanksContributions.module.css";
import { getBrowserId } from "./utils/browserId";

const ThanksTestimonies = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [list, setList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const browserId = getBrowserId();

  const fetchList = async () => {
    try {
      const res = await fetch("/api/testimonies", {
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
    if (!name || !type) {
      setError("All fields are required");
      return;
    }
    setError("");

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, newName: name, newType: type }
      : { name, type };

    try {
      const res = await fetch("/api/testimonies", {
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
      setType("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/testimonies?id=${id}`, {
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
    setType(item.type);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setType("");
    setError("");
  };

  return (
    <div className={styles.container}>
      <h3>{t("event.display.testimonyTitle")}</h3>
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
          <label>{t("event.display.testimonyOrSong")}</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t("event.display.chooseOption")}</option>
            <option value="testimony">{t("event.display.testimony")}</option>
            <option value="song">{t("event.display.song")}</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit">
            {editingId
              ? t("event.display.updateTestimony")
              : t("event.display.addTestimony")}
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
          ? t("event.display.hideTestimoniesList")
          : t("event.display.showTestimoniesList")}
      </button>

      {showList && (
        <>
          {list.length === 0 ? (
            <p>{t("event.display.noTestimonies")}</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("event.display.nameColumn")}</th>
                  <th>{t("event.display.typeColumn")}</th>
                  <th>{t("event.display.actionColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
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

export default ThanksTestimonies;
