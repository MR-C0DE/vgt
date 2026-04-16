import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./stylesheets/Countdown.module.css";

const Countdown = ({ targetDate }) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  function getTimeRemaining(date) {
    const now = new Date();
    const target = new Date(date);
    const total = target - now;

    if (total <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }

  const labels = {
    fr: {
      days: "Jours",
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
    },
    en: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  };

  const l = labels[language];

  return (
    <div className={styles.countdown}>
      <div className={styles.block}>
        <span className={styles.value}>{timeLeft.days}</span>
        <span className={styles.label}>{l.days}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.value}>{timeLeft.hours}</span>
        <span className={styles.label}>{l.hours}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.value}>{timeLeft.minutes}</span>
        <span className={styles.label}>{l.minutes}</span>
      </div>
      <div className={styles.block}>
        <span className={styles.value}>{timeLeft.seconds}</span>
        <span className={styles.label}>{l.seconds}</span>
      </div>
    </div>
  );
};

export default Countdown;
