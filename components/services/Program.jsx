import React from "react";
import Link from "next/link"; // Importer Link
import styles from "./stylesheets/Program.module.css";
import { useTranslation } from "next-i18next";
import { Calendar, Clock, Users } from "lucide-react";

const Program = () => {
  const { t } = useTranslation();

  const programs = [
    {
      key: "sunday",
      icon: Calendar,
      color: "#4A6FA5",
    },
    {
      key: "wednesday",
      icon: Users,
      color: "#6B4E71",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>{t("weekly_programs")}</h2>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.programsGrid}>
        {programs.map((program, index) => {
          const IconComponent = program.icon;
          return (
            <div key={index} className={styles.info}>
              <div className={styles.iconWrapper}>
                <IconComponent size={32} color={program.color} />
              </div>
              <h3 className={styles.title}>{t(`${program.key}_worship`)}</h3>
              <div className={styles.timeWrapper}>
                <Clock size={16} className={styles.clockIcon} />
                <h4 className={styles.time}>{t(`${program.key}_time`)}</h4>
              </div>
              <p className={styles.description}>
                {t(`${program.key}_description`)}
              </p>
              <div className={styles.cardFooter}>
                <Link href="/contact" className={styles.joinButton}>
                  {t("join_us")} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Program;
