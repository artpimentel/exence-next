"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./FilterPopup.module.css";
import { CiFilter } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

import Popup from "@/components/ui/Popup/Popup";
import type { Producer } from "@/types/Producer";

import { filterSections } from "./filterSections";
import CheckFilter from "./checkFilter";
import RangeFilter from "./rangeFilter";

interface FilterOption {
  category: string;
  options: string[];
}

interface FilterPopupProps {
  filters: FilterOption[];
  currentSelectedFilters: Record<string, string[]>;
  onApplyFilters: (newFilters: Record<string, string[]>) => void;
  onClearAllFilters: () => void;
  selectedGender?: string | null;
  producers?: Producer[];
}

interface RangeValue {
  min: number;
  max: number;
}

export default function FilterPopup({
  filters,
  currentSelectedFilters,
  onApplyFilters,
  onClearAllFilters,
  selectedGender,
  producers = [],
}: FilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [localSelectedFilters, setLocalSelectedFilters] = useState(
    currentSelectedFilters
  );

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedFilters(currentSelectedFilters);
    }
  }, [isOpen, currentSelectedFilters]);

  function toggleLocalFilter(category: string, option: string) {
    setLocalSelectedFilters((prev) => {
      const prevOptions = prev[category] || [];
      const alreadySelected = prevOptions.includes(option);

      return {
        ...prev,
        [category]: alreadySelected
          ? prevOptions.filter((o) => o !== option)
          : [...prevOptions, option],
      };
    });
  }

  const getRangeFromProducers = (field: "height" | "mannequin" | "feet") => {
    if (producers.length === 0) return { min: 0, max: 100 };

    const values = producers
      .map((p) => {
        if (field === "height") return p.appearance?.Altura;
        if (field === "mannequin") return p.appearance?.Manequim;
        if (field === "feet") return p.appearance?.Pés;
        return null;
      })
      .filter((v): v is number => v !== null && v !== undefined);

    if (values.length === 0) return { min: 0, max: 100 };

    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const heightRange = getRangeFromProducers("height");
  const mannequinRange = getRangeFromProducers("mannequin");
  const feetRange = getRangeFromProducers("feet");

  const [rangeValues, setRangeValues] = useState<Record<string, RangeValue>>({
    Altura: heightRange,
    Manequim: mannequinRange,
    Pes: feetRange,
  });

  const [activeSection, setActiveSection] = useState<string>("aparencia");
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = contentRef.current!.scrollTop + 200;

      for (const section of filterSections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      const offsetTop = element.offsetTop - 20;
      contentRef.current.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleClearAndApply = () => {
    onClearAllFilters();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(currentSelectedFilters).reduce(
    (sum, options) => sum + options.length,
    0
  );

  return (
    <Popup
      trigger={
        <>
          Filtros
          {activeFiltersCount > 0 && (
            <span className={styles.badge}>{activeFiltersCount}</span>
          )}
          <span>
            <CiFilter />
          </span>
        </>
      }
      triggerClass={styles.trigger}
      popupClass={styles.popup}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <>
        <div className={styles.header}>
          <h1>Filtros</h1>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Fechar filtros"
          >
            <IoIosClose />
          </button>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav className={styles.topics}>
              {filterSections.map((section) => (
                <button
                  key={section.id}
                  className={`${styles.topicLink} ${
                    activeSection === section.id ? styles.active : ""
                  }`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          <div className={styles.content} ref={contentRef}>
            {filterSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className={styles.filterSection}
              >
                <h2 className={styles.sectionTitle}>{section.title}</h2>

                {section.filters.map((filter) => (
                  <div key={filter.category} className={styles.filterGroup}>
                    <h3 className={styles.filterLabel}>{filter.label}</h3>

                    {filter.type === "checkbox" && filter.options && (
                      <CheckFilter
                        filter={filter}
                        selectedFilters={localSelectedFilters}
                        onToggleFilter={toggleLocalFilter}
                      />
                    )}

                    {filter.type === "range" && (
                      <RangeFilter
                        filter={filter}
                        rangeValues={rangeValues}
                        setRangeValues={setRangeValues}
                        ranges={{
                          Altura: heightRange,
                          Manequim: mannequinRange,
                          Pes: feetRange,
                        }}
                      />
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.clearButton}
            onClick={handleClearAndApply}
            disabled={activeFiltersCount === 0}
          >
            Limpar Filtros
          </button>
          <button
            className={styles.applyButton}
            onClick={() => {
              onApplyFilters(localSelectedFilters);
              setIsOpen(false);
            }}
          >
            Aplicar Filtros
          </button>
        </div>
      </>
    </Popup>
  );
}
