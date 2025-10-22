"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";

import Popup from "@/components/ui/Popup/Popup";
import LocationSelector from "@/components/LocationSelector/LocationSelector";
import Dropdown from "../ui/Dropdown/Dropdown";

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
        <Link href="/">
          <img src="/ExenceLogo.svg" alt="Logo" className={styles.logo} />
        </Link>

        <LocationSelector />

        <div className={styles.headerButtons}>
          <Dropdown
            trigger={"Cadastre-se"}
            triggerClassName={styles.signUpTrigger}
            menuClassName={styles.signUpMenu}
          >
            <Link href="/signup" className={styles.menuItem}>
              Como Cliente
            </Link>
            <Link href="/signup" className={styles.menuItem}>
              Como Anunciante
            </Link>
          </Dropdown>

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
              <button className={styles.closeButton}>
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
