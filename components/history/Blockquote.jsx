import React from 'react'
import styles from "./stylesheets/Blockquote.module.css";
import { useTranslation } from "next-i18next";
const Blockquote = () => {
  const { t } = useTranslation();
  return (
    <figure className={styles.dds__blockquote}>
    <blockquote>
      <p>
      Mais, regardez bien. Jésus a dit qu’en ce temps de la fin, de nouveau, les deux esprits seraient encore très proches l’un de l’autre. Pas vrai? [L’assemblée dit : “Amen.” — N.D.É.] Maintenant remarquez. Ce sera plus proche encore qu’à cette époque-là. C’est maintenant le temps de la fin. Oh, mes enfants! Que Dieu ait pitié de nous! Si bien que “ce serait tellement réel, au point de séduire même les Élus, si possible”. Maintenant, comment allez-vous... comment a-t‐on fait pour savoir à ces époques-là? Comment allez-vous faire pour savoir aujourd’hui? Par le même moyen, en vous en tenant à la Parole, “Jésus-Christ, le même hier, aujourd’hui et pour toujours”.
<br />Maintenant, prêtez attention à tout ce Message. Et, quand vous écouterez la bande, peut-être même que je serai parti, un jour, quand le Seigneur n’aura plus besoin de moi ici sur terre, vous vous référerez à cela. Écoutez ma voix, ce que je suis en train de vous dire. S’Il me prend avant Sa Venue, souvenez-vous bien, je vous ai parlé au Nom du Seigneur, par la Parole du Seigneur. Oui.
        {/*t("quote") */}
      </p>
    </blockquote>
    <figcaption>
      —<cite>{t("ref")}</cite>
    </figcaption>
  </figure>
  )
}

export default Blockquote