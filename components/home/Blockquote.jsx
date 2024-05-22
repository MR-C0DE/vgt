import React from 'react'
import styles from "./stylesheets/Blockquote.module.css";
const Blockquote = () => {
  return (
    <figure className={styles.dds__blockquote}>
    <blockquote>
      <p>
        Que celui qui a des oreilles entende ce que l'Esprit dit aux
        Églises!
      </p>
    </blockquote>
    <figcaption>
      —<cite>Apocslypse 3.22</cite>
    </figcaption>
  </figure>
  )
}

export default Blockquote