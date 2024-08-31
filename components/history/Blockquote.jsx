import React from "react";
import styles from "./stylesheets/Blockquote.module.css";
import { useTranslation } from "next-i18next";
import { useLanguage } from "../contexts/LanguageContext";
const Blockquote = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const cite = {
    fr: [
      "Mais, regardez bien. Jésus a dit qu’en ce temps de la fin, de nouveau, les deux esprits seraient encore très proches l’un de l’autre. Pas vrai? [L’assemblée dit : “Amen.” — N.D.É.] Maintenant remarquez. Ce sera plus proche encore qu’à cette époque-là. C’est maintenant le temps de la fin. Oh, mes enfants! Que Dieu ait pitié de nous! Si bien que “ce serait tellement réel, au point de séduire même les Élus, si possible”. Maintenant, comment allez-vous... comment a-t‐on fait pour savoir à ces époques-là? Comment allez-vous faire pour savoir aujourd’hui? Par le même moyen, en vous en tenant à la Parole, “Jésus-Christ, le même hier, aujourd’hui et pour toujours”.",
      "Maintenant, prêtez attention à tout ce Message. Et, quand vous écouterez la bande, peut-être même que je serai parti, un jour, quand le Seigneur n’aura plus besoin de moi ici sur terre, vous vous référerez à cela. Écoutez ma voix, ce que je suis en train de vous dire. S’Il me prend avant Sa Venue, souvenez-vous bien, je vous ai parlé au Nom du Seigneur, par la Parole du Seigneur. Oui.",
      "65-0725M - Les oints du temps de la fin",
    ],
    en: [
      "But watch. Jesus said, that, in this end time, again, the two spirits would be real close together again. Is that right? [Congregation says, “Amen.”—Ed.] Now notice. It will be closer than that was. This is the end time. Oh, children! God have mercy upon us! Till, “It would even be so real till it would deceive the very Elected if possible.” Now how do you go…how did we tell it in them days? How you going to tell it today? The same way, stay with the Word, “Jesus Christ the same yesterday, today, and forever.”",
      "Now care all this Message. And when you listen to the tape, even maybe I’ll be gone someday when the Lord is finished with me here on earth, you’ll refer back to this. Listen to my voice, what I’m telling you. If He takes me before His Coming, just remember, I’ve spoke to you in the Name of the Lord, by the Word of the Lord. Yes.",
      "65-0725M - The Anointed Ones At The End Time",
    ],
  };

  return (
    <figure className={styles.dds__blockquote}>
      <blockquote>
        <p>
          {cite[language][0]}

          <br />
          <br />
          {cite[language][1]}
          {/*t("quote") */}
        </p>
      </blockquote>
      <figcaption>
        —<cite>{cite[language][2]}</cite>
      </figcaption>
    </figure>
  );
};

export default Blockquote;
