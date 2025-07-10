import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./stylesheets/SafariConfirmationList.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <button
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </>
  );
};

const SafariConfirmationList = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFormId, setUserFormId] = useState(null);

  // Modal states
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for participant + accompagnants
  const [formData, setFormData] = useState({
    // participant fields
    first_name: "",
    last_name: "",
    age_category: "",
    contribution: "",
    medical_issues: "",
    medical_details: "",
    is_driver: "",
    accompagnant_is_driver: "",
    has_space: "",
    capacity: 0,
    vehicle: "",
    phone: "",
    accompagnants: [], // tableau d'accompagnants
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/safari_confirmation", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(t("event.display.fetchError"));
        const result = await response.json();
        setSubmissions(Array.isArray(result.data) ? result.data : []);
        const idFromCookie = Cookies.get("form_submit_id");
        if (idFromCookie) setUserFormId(idFromCookie);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  // Ouvre modal en mode lecture
  const openModalView = (entry) => {
    setSelectedEntry(entry);
    // Recopie participant + accompagnants dans formData pour faciliter edition si besoin
    setFormData({
      ...entry,
      accompagnants: entry.accompagnants || [],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Ouvre modal en mode édition
  const openModalEdit = (entry) => {
    setSelectedEntry(entry);
    setFormData({
      ...entry,
      accompagnants: entry.accompagnants || [],
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
    setIsEditing(false);
    setFormData({
      first_name: "",
      last_name: "",
      age_category: "",
      contribution: "",
      medical_issues: "",
      medical_details: "",
      is_driver: "",
      accompagnant_is_driver: "",
      has_space: "",
      capacity: 0,
      vehicle: "",
      phone: "",
      accompagnants: [],
    });
  };

  // Gestion modification champs participant
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // Gestion modification champs accompagnants (index dans le tableau accompagnants)
  const handleAccompagnantChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((f) => {
      const newAccompagnants = [...f.accompagnants];
      newAccompagnants[index] = { ...newAccompagnants[index], [name]: value };
      return { ...f, accompagnants: newAccompagnants };
    });
  };

  // Ajout accompagnant vide
  const addAccompagnant = () => {
    setFormData((f) => ({
      ...f,
      accompagnants: [
        ...f.accompagnants,
        {
          firstName: "",
          lastName: "",
          ageCategory: "",
          contribution: "",
          allergies: "",
          medicalDetails: "",
        },
      ],
    }));
  };

  // Suppression accompagnant
  const removeAccompagnant = (index) => {
    setFormData((f) => {
      const newAccompagnants = [...f.accompagnants];
      newAccompagnants.splice(index, 1);
      return { ...f, accompagnants: newAccompagnants };
    });
  };

  // Sauvegarde modifications participant + accompagnants
  const handleSave = async () => {
    // Validation possible ici

    try {
      const response = await fetch("/api/safari_confirmation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEntry.id, ...formData }),
      });
      if (!response.ok) throw new Error("Update failed");

      // Mise à jour locale du tableau des submissions
      setSubmissions((prev) =>
        prev.map((s) => (s.id === selectedEntry.id ? { ...s, ...formData } : s))
      );

      closeModal();
    } catch (error) {
      alert(t("event.display.updateError") || "Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("event.display.confirmDelete"))) return;
    try {
      const response = await fetch("/api/safari_confirmation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Delete failed");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedEntry?.id === id) closeModal();
    } catch (error) {
      alert(t("event.display.deleteError"));
      console.error(error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>{t("event.display.title")}</h2>

      {loading && <p>{t("event.display.loading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("event.display.name")}</th>
                <th>{t("event.display.age")}</th>
                <th>{t("event.display.contribution")}</th>
                <th>{t("event.display.driver")}</th>
                <th>{t("event.display.seats")}</th>
                <th>{t("event.display.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    {t("event.display.noData")}
                  </td>
                </tr>
              ) : (
                submissions.map((entry, index) => (
                  <tr
                    key={entry.id}
                    onClick={() => openModalView(entry)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openModalView(entry);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="#">{index + 1}</td>
                    <td data-label={t("event.display.name")}>
                      {entry.first_name} {entry.last_name}
                    </td>
                    <td data-label={t("event.display.age")}>
                      {entry.age_category}
                    </td>
                    <td data-label={t("event.display.contribution")}>
                      {entry.contribution || "—"}
                    </td>
                    <td data-label={t("event.display.driver")}>
                      {entry.is_driver === "yes"
                        ? t("event.display.yes")
                        : t("event.display.no")}
                    </td>
                    <td data-label={t("event.display.seats")}>
                      {entry.has_space === "yes" ? entry.capacity || 0 : "—"}
                    </td>
                    <td data-label={t("event.display.actions")}>
                      {entry.form_submit_id === userFormId ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModalEdit(entry);
                            }}
                            className={styles.editBtn}
                          >
                            {t("event.display.edit")}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry.id);
                            }}
                            className={styles.deleteBtn}
                          >
                            {t("event.display.delete")}
                          </button>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedEntry && !isEditing && (
          <div className={styles.modalDetails}>
            <h3>
              {selectedEntry.first_name} {selectedEntry.last_name}
            </h3>
            <p>
              <strong>{t("event.display.age")}:</strong>{" "}
              {selectedEntry.age_category}
            </p>
            <p>
              <strong>{t("event.display.contribution")}:</strong>{" "}
              {selectedEntry.contribution || "—"}
            </p>
            <p>
              <strong>{t("event.display.medicalIssues")}:</strong>{" "}
              {selectedEntry.medical_issues}
            </p>
            <p>
              <strong>{t("event.display.medicalDetails")}:</strong>{" "}
              {selectedEntry.medical_details || "—"}
            </p>
            <p>
              <strong>{t("event.display.driver")}:</strong>{" "}
              {selectedEntry.is_driver === "yes"
                ? t("event.display.yes")
                : t("event.display.no")}
            </p>
            <p>
              <strong>{t("event.display.hasSpace")}:</strong>{" "}
              {selectedEntry.has_space === "yes"
                ? t("event.display.yes")
                : t("event.display.no")}
            </p>
            <p>
              <strong>{t("event.display.capacity")}:</strong>{" "}
              {selectedEntry.capacity || 0}
            </p>
            <p>
              <strong>{t("event.display.vehicle")}:</strong>{" "}
              {selectedEntry.vehicle || "—"}
            </p>
            <p>
              <strong>{t("event.display.phone")}:</strong>{" "}
              {selectedEntry.phone || "—"}
            </p>

            {/* Liste accompagnants */}
            <h4 style={{ marginTop: "1.5rem" }}>
              {t("event.display.accompagnants")}
            </h4>
            <p>
              un conducteur parmi les accompagnants :{" "}
              {selectedEntry.accompagnant_is_driver
                ? t("event.display.yes")
                : t("event.display.no")}
            </p>
            {selectedEntry.accompagnants &&
            selectedEntry.accompagnants.length > 0 ? (
              <ul>
                {selectedEntry.accompagnants.map((acc, i) => (
                  <li key={i}>
                    {acc.first_name} {acc.last_name} - {acc.age_category} -{" "}
                    {acc.contribution || "—"} - {acc.allergies || "—"} -{" "}
                    {acc.medical_details || "—"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("event.display.noAccompagnants")}</p>
            )}

            <div className={styles.modalActions}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editBtn}
              >
                {t("event.display.edit")}
              </button>
              <button
                onClick={() => handleDelete(selectedEntry.id)}
                className={styles.deleteBtn}
              >
                {t("event.display.delete")}
              </button>
            </div>
          </div>
        )}

        {selectedEntry && isEditing && (
          <form
            className={styles.modalForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <h3>{t("event.display.editEntry")}</h3>

            {/* Participant */}
            <label>
              {t("event.display.firstName")}
              <input
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              {t("event.display.lastName")}
              <input
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              {t("event.display.age")}
              <select
                name="age_category"
                value={formData.age_category || ""}
                onChange={handleChange}
                required
              >
                <option value="adult">{t("event.display.adult")}</option>
                <option value="child">{t("event.display.child")}</option>
                <option value="toddler">{t("event.display.toddler")}</option>
                <option value="baby">{t("event.display.baby")}</option>
              </select>
            </label>
            <label>
              {t("event.display.contribution")}
              <input
                name="contribution"
                value={formData.contribution || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("event.display.medicalIssues")}
              <select
                name="medical_issues"
                value={formData.medical_issues || ""}
                onChange={handleChange}
                required
              >
                <option value="yes">{t("event.display.yes")}</option>
                <option value="no">{t("event.display.no")}</option>
                <option value="private">{t("event.display.private")}</option>
              </select>
            </label>
            <label>
              {t("event.display.medicalDetails")}
              <textarea
                name="medical_details"
                value={formData.medical_details || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("event.display.isDriver")}
              <select
                name="is_driver"
                value={formData.is_driver || ""}
                onChange={handleChange}
                required
              >
                <option value="yes">{t("event.display.yes")}</option>
                <option value="no">{t("event.display.no")}</option>
              </select>
            </label>
            <label>
              {t("event.display.accompagnantIsDriver")}
              <select
                name="accompagnant_is_driver"
                value={formData.accompagnant_is_driver || ""}
                onChange={handleChange}
              >
                <option value="yes">{t("event.display.yes")}</option>
                <option value="no">{t("event.display.no")}</option>
              </select>
            </label>
            <label>
              {t("event.display.hasSpace")}
              <select
                name="has_space"
                value={formData.has_space || ""}
                onChange={handleChange}
              >
                <option value="">—</option>
                <option value="yes">{t("event.display.yes")}</option>
                <option value="no">{t("event.display.no")}</option>
              </select>
            </label>
            <label>
              {t("event.display.capacity")}
              <input
                type="number"
                name="capacity"
                min="0"
                value={formData.capacity || ""}
                onChange={handleChange}
                disabled={formData.has_space !== "yes"}
              />
            </label>
            <label>
              {t("event.display.vehicle")}
              <input
                name="vehicle"
                value={formData.vehicle || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              {t("event.display.phone")}
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </label>

            {/* Accompagnants */}
            <h4 style={{ marginTop: "1.5rem" }}>
              {t("event.display.accompagnants")}
            </h4>
            {formData.accompagnants.length === 0 && (
              <p>{t("event.display.noAccompagnants")}</p>
            )}
            {formData.accompagnants.map((acc, i) => (
              <fieldset
                key={i}
                style={{
                  border: "1px solid #ddd",
                  marginBottom: "1rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "6px",
                }}
              >
                <legend>
                  {t("event.display.accompagnant")} #{i + 1}
                  <button
                    type="button"
                    onClick={() => removeAccompagnant(i)}
                    style={{
                      marginLeft: "1rem",
                      backgroundColor: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0 0.5rem",
                      cursor: "pointer",
                    }}
                    aria-label={t("event.display.removeAccompagnant")}
                  >
                    ×
                  </button>
                </legend>

                <label>
                  {t("event.display.firstName")}
                  <input
                    name="firstName"
                    value={acc.first_name || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                    required
                  />
                </label>
                <label>
                  {t("event.display.lastName")}
                  <input
                    name="lastName"
                    value={acc.last_name || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                    required
                  />
                </label>
                <label>
                  {t("event.display.age")}
                  <select
                    name="ageCategory"
                    value={acc.age_category || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                    required
                  >
                    <option value="adult">{t("event.display.adult")}</option>
                    <option value="child">{t("event.display.child")}</option>
                    <option value="toddler">
                      {t("event.display.toddler")}
                    </option>
                    <option value="baby">{t("event.display.baby")}</option>
                  </select>
                </label>
                <label>
                  {t("event.display.contribution")}
                  <input
                    name="contribution"
                    value={acc.contribution || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                  />
                </label>
                <label>
                  {t("event.display.allergies")}
                  <input
                    name="allergies"
                    value={acc.allergies || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                  />
                </label>
                <label>
                  {t("event.display.medicalDetails")}
                  <textarea
                    name="medicalDetails"
                    value={acc.medical_details || ""}
                    onChange={(e) => handleAccompagnantChange(i, e)}
                  />
                </label>
              </fieldset>
            ))}

            <button
              type="button"
              onClick={addAccompagnant}
              style={{
                backgroundColor: "#1a73e8",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              {t("event.display.addAccompagnant")}
            </button>

            <div className={styles.modalActions}>
              <button type="submit" className={styles.saveBtn}>
                {t("event.display.save")}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className={styles.cancelBtn}
              >
                {t("event.display.cancel")}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SafariConfirmationList;
