"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";

import Popup from "@/components/ui/Popup/Popup";
import LocationSelector from "@/components/LocationSelector/LocationSelector";
import Dropdown from "../ui/Dropdown/Dropdown";

import SignUp from "@/components/Signup/Signup";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("br");

  const languages = [
    { code: "br", country: "Brasil", label: "Português" },
    { code: "us", country: "United States", label: "English" },
    { code: "es", country: "España", label: "Español" },
  ];

  const currentLang = languages.find((lang) => lang.code === selectedLang);

  return (
    <header className={styles.header}>
      <div className={styles.layout}>
        <div className={styles.left}>
          <Link href="/">
            <img src="/ExenceLogo.svg" alt="Logo" className={styles.logo} />
          </Link>

          <LocationSelector />

          <Link href="/home" className={styles.news}>
            Novidades
          </Link>
        </div>

        <div className={styles.headerButtons}>
          <SignUp />
          <Link href="/signin" className={styles.logInTrigger}>
            Entre
          </Link>

          <Popup
            trigger={
              <>
                <img
                  src={`/flags/${currentLang?.code}.svg`}
                  alt={currentLang?.label}
                  className={styles.flagProp}
                />
                <IoIosArrowDown />
              </>
            }
            triggerClass={styles.trigger}
            popupClass={styles.popup}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          >
            <div className={styles.popupHeader}>
              <span>Região e Linguagem</span>{" "}
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                <IoIosClose />
              </button>
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.languageOption} ${
                  lang.code === selectedLang ? styles.activeLang : ""
                }`}
                onClick={() => {
                  setSelectedLang(lang.code);
                  setIsOpen(false);
                }}
              >
                <img
                  src={`/flags/${lang.code}.svg`}
                  alt={lang.label}
                  className={styles.flagProp}
                />
                <div className={styles.langLabel}>
                  <strong>{lang.country}</strong>
                  {lang.label}
                </div>
              </button>
            ))}
          </Popup>
        </div>
      </div>
    </header>
  );
}

export default Header;
