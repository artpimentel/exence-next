"use client";

import React, { useState } from "react";
import styles from "./StartPopup.module.css";

interface StartPopupProps {
  onConfirmAge: () => void;
  onExitSite: () => void;
}

const StartPopup: React.FC<StartPopupProps> = ({
  onConfirmAge,
  onExitSite,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleConfirmAge = () => {
    sessionStorage.setItem("ageConfirmed", "true");
    setIsVisible(false);
    onConfirmAge();
  };

  const handleExitSite = () => {
    setIsVisible(false);
    onExitSite();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Este site é para maiores de 18 anos!</h2>

        <div className={styles.ctaContainer}>
          <button className={styles.registerButton} onClick={handleConfirmAge}>
            Sou maior, entrar!
          </button>
          <button className={styles.loginButton} onClick={handleExitSite}>
            Não sou maior, sair.
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPopup;
