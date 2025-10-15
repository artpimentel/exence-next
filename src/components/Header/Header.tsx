"use client";

import Link from "next/link";
import styles from "./Header.module.css";

import { IoSearchOutline } from "react-icons/io5";

import Dropdown from "../ui/Dropdown/Dropdown";

function Header() {
  const languages = [
    { code: "br", label: "Português" },
    { code: "us", label: "English" },
    { code: "es", label: "Español" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.layout}>
        <Link href="/">
          <img src="/ExenceLogo.svg" alt="Logo" className={styles.logo} />
        </Link>

        <div className={styles.searchBar}>
          <input
            type="search"
            placeholder="Buscar"
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <IoSearchOutline />
          </button>
        </div>

        <div className={styles.langs}>
          {languages.map((lang) => (
            <i key={lang.code} className={styles.languageOption}>
              <img
                src={`/flags/${lang.code}.svg`}
                alt={lang.label}
                className={styles.flagProp}
              />
            </i>
          ))}
        </div>

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
        </div>
      </div>
    </header>
  );
}

export default Header;
