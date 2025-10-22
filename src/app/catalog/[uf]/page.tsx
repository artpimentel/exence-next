"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import styles from "./page.module.css";

import FilterPopup from "@/components/FilterPopup/FilterPopup";
import ProductsCatalog from "@/components/ProductsCatalog/ProductsCatalog";

import type { Producer } from "@/types/Producer";
import allProducers from "@/data/producers";

interface CatalogProps {
  params: { uf: string };
}

function getUniqueGenders(producers: Producer[]) {
  const genders = new Set(
    producers
      .map((p) => p.profile.gender)
      .filter((g): g is NonNullable<typeof g> => g !== undefined)
  );
  return Array.from(genders);
}

function getUniqueFilters(producers: Producer[]) {
  const filtersMap: { [key: string]: Set<string> } = {};

  producers.forEach((producer) => {
    Object.entries(producer.appearance).forEach(([category, value]) => {
      if (!filtersMap[category]) {
        filtersMap[category] = new Set();
      }
      filtersMap[category].add(value.toString());
    });
  });

  return Object.entries(filtersMap).map(([category, optionsSet]) => ({
    category,
    options: Array.from(optionsSet).sort(),
  }));
}

export default function Catalog({ params }: CatalogProps) {
  const { uf } = params;
  const normalizedUf = uf.toUpperCase();

  const producersByUf = useMemo(
    () => allProducers.filter((p) => p.locality.state === normalizedUf),
    [normalizedUf]
  );

  const filterData = getUniqueFilters(producersByUf);
  const rawGenderFilters = getUniqueGenders(producersByUf);
  const desiredGenderOrder = ["female", "male", "femaletrans"];
  const genderFilters = rawGenderFilters.sort(
    (a, b) => desiredGenderOrder.indexOf(a) - desiredGenderOrder.indexOf(b)
  );

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | "femaletrans" | null
  >("female");

  function genderDisplayName(gender: string) {
    switch (gender) {
      case "female":
        return "Feminino";
      case "male":
        return "Masculino";
      case "femaletrans":
        return "Trans";
      default:
        return gender;
    }
  }

  function applyFilters(newFilters: Record<string, string[]>) {
    setSelectedFilters(newFilters);
  }

  function clearAllFilters() {
    setSelectedFilters({});
    setSelectedGender(null);
  }

  const filteredProducers = producersByUf.filter((producer) => {
    const matchesGender =
      !selectedGender || producer.profile.gender === selectedGender;
    const noFiltersSelected = Object.values(selectedFilters).every(
      (opts) => opts.length === 0
    );
    if (noFiltersSelected && !selectedGender) return true;

    const matchesOtherFilters = Object.entries(selectedFilters).every(
      ([category, options]) => {
        if (options.length === 0) return true;
        const value =
          producer.appearance[category as keyof typeof producer.appearance];
        return options.includes(value.toString());
      }
    );

    return matchesGender && matchesOtherFilters;
  });

  const selectorRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    if (!selectorRef.current || !selectedGender) return;

    const buttons = Array.from(
      selectorRef.current.querySelectorAll<HTMLButtonElement>("button")
    );
    const index = genderFilters.indexOf(selectedGender);
    const btn = buttons[index];

    setHighlightStyle({
      width: btn.offsetWidth,
      left: btn.offsetLeft,
    });
  }, [selectedGender, genderFilters]);

  return (
    <div className={styles.layout}>
      <div className={styles.genderSelector} ref={selectorRef}>
        <div
          className={styles.highlight}
          style={{
            width: highlightStyle.width,
            transform: `translateX(${highlightStyle.left}px)`,
          }}
        />
        {genderFilters.map((gender) => {
          const isSelected = selectedGender === gender;
          return (
            <button
              key={gender}
              className={`${styles.genderButton} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => setSelectedGender(isSelected ? null : gender)}
            >
              {genderDisplayName(gender)}
            </button>
          );
        })}
      </div>
      <FilterPopup
        filters={filterData}
        currentSelectedFilters={selectedFilters}
        onApplyFilters={applyFilters}
        onClearAllFilters={clearAllFilters}
        producers={producersByUf}
      />
      <ProductsCatalog producers={filteredProducers} />
    </div>
  );
}
