import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import styles from "./stylesheets/ThanksContributions.module.css";
import { getBrowserId } from "./utils/browserId";

const ThanksContributions = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [contribution, setContribution] = useState("");
  const [list, setList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const browserId = getBrowserId();

  const fetchList = async () => {
    try {
      const res = await fetch("/api/contributions", {
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
    if (!name || !contribution) {
      setError("All fields are required");
      return;
    }
    setError("");

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, newName: name, newContribution: contribution }
      : { name, contribution };

    try {
      const res = await fetch("/api/contributions", {
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
        setList(list.map((item) => (item._id === editingId ? newItem : item)));
        setEditingId(null);
      } else {
        setList([newItem, ...list]);
      }

      setName("");
      setContribution("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/contributions?id=${id}`, {
        method: "DELETE",
        headers: { "x-browser-id": browserId },
      });
      if (res.status === 403) {
        setError("You cannot delete this item from another browser");
        return;
      }
      setList(list.filter((item) => item._id !== id));
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
    setEditingId(item._id);
    setName(item.name);
    setContribution(item.contribution);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setContribution("");
    setError("");
  };

  return (
    <div className={styles.container}>
      <h3>{t("event.display.contributionTitle")}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>{t("event.display.nameLabel")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("event.display.namePlaceholder")}
          />
        </div>
        <div>
          <label>{t("event.display.contributionLabel")}</label>
          <input
            type="text"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder={t("event.display.contributionPlaceholder")}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit">
            {editingId
              ? t("event.display.updateContribution")
              : t("event.display.addContribution")}
          </button>
          {editingId && (
            <button
              type="button"
              className={styles.cancel}
              onClick={handleCancel}
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
          ? t("event.display.hideContributionsList")
          : t("event.display.showContributionsList")}
      </button>

      {showList && (
        <>
          {list.length === 0 ? (
            <p>{t("event.display.noContributions")}</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("event.display.nameColumn")}</th>
                  <th>{t("event.display.contributionColumn")}</th>
                  <th>{t("event.display.actionColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.contribution}</td>
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
                            onClick={() => handleDelete(item._id)}
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

export default ThanksContributions;
