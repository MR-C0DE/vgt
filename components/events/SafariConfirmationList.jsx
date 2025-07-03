import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import styles from "./stylesheets/SafariConfirmationList.module.css";

const SafariConfirmationList = () => {
  const { t } = useTranslation();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/safari_confirmation", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(t("event.display.fetchError"));
        }

        const result = await response.json();
        setSubmissions(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

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
                <th>{t("event.display.allergies")}</th>
                <th>{t("event.display.driver")}</th>
                <th>{t("event.display.seats")}</th>
                <th>{t("event.display.vehicle")}</th>
                <th>{t("event.display.phone")}</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    {t("event.display.noData")}
                  </td>
                </tr>
              ) : (
                submissions.map((entry, index) => (
                  <tr key={index}>
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
                    <td data-label={t("event.display.allergies")}>
                      {entry.medical_issues === "yes"
                        ? `${t("event.display.yes")} (${
                            entry.medical_details || "—"
                          })`
                        : entry.medical_issues === "private"
                        ? t("event.display.private")
                        : t("event.display.no")}
                    </td>
                    <td data-label={t("event.display.driver")}>
                      {entry.is_driver === "yes"
                        ? t("event.display.yes")
                        : t("event.display.no")}
                    </td>
                    <td data-label={t("event.display.seats")}>
                      {entry.has_space === "yes"
                        ? entry.capacity || 0
                        : t("event.display.no")}
                    </td>
                    <td data-label={t("event.display.vehicle")}>
                      {entry.vehicle || "—"}
                    </td>
                    <td data-label={t("event.display.phone")}>{entry.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SafariConfirmationList;
