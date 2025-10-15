import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import styles from "./DropDown.module.css";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  menuClassName?: string;
  containerClassName?: string;
}

function Dropdown({
  trigger,
  children,
  triggerClassName = "",
  menuClassName = "",
  containerClassName = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`${styles.dropdown} ${containerClassName}`}
      ref={dropdownRef}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${styles.trigger} ${triggerClassName}`}
      >
        {trigger}
        <IoIosArrowDown />
      </div>

      <div
        className={`${styles.menu} ${open ? styles.open : ""} ${menuClassName}`}
      >
        <div className={styles.layout}>{children}</div>
      </div>
    </div>
  );
}

export default Dropdown;
