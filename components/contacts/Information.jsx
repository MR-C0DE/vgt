import React from "react";
import styles from "./stylesheets/Information.module.css";

const Information = () => {
  // Informations par défaut
  const defaultAddress = "2558 Boulevard Saint-Laurent, VGR";
  const defaultPhone = "+1 (555) 123-4567";
  const defaultEmail = "info@example.com";

  return (
    <div className={styles.Information}>
      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/location.svg" alt="Location Icon" />
        </div>
        <p className={styles.info_title}>Address</p>
        <div>
          <p className={styles.info_detail}>{defaultAddress}</p>
          <p className={styles.info_description}>Address of the location</p>
        </div>
      </div>

      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/phone.svg" alt="Phone Icon" />
        </div>
        <p className={styles.info_title}>Phone</p>
        <div>
          <p className={styles.info_detail}>{defaultPhone}</p>
          <p className={styles.info_description}>Contact phone number</p>
        </div>
      </div>

      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/email.svg" alt="Email Icon" />
        </div>
        <p className={styles.info_title}>Email</p>
        <div>
          <p className={styles.info_detail}>{defaultEmail}</p>
          <p className={styles.info_description}>Contact email address</p>
        </div>
      </div>
    </div>
  );
};

export default Information;
