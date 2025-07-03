import React from "react";
import styles from "./stylesheets/Photo.module.css";

const Photo = () => {
  return (
    <div className={styles.container}>
      <img
        src="/images/bsp.jpg" // Assure-toi que le chemin est correct par rapport à "public/"
        className={styles.photo}
        alt="Church in the basement"
      />
    </div>
  );
};

export default Photo;
