import React from "react";
import styles from "./stylesheets/Footer.module.css";
const Footer = () => {
  const date = new Date();

  return (
    <div className={styles.Footer}>{date.getFullYear()} &copy; Voice of God Tabernacle - Ottawa</div>
  );
};

export default Footer;
