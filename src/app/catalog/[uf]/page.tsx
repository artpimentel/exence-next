"use client";

import { useRef, useEffect, useState, useMemo, use } from "react";
import styles from "./page.module.css";
import { IoFilterOutline } from "react-icons/io5";

import FilterPopup from "@/components/FilterPopup/FilterPopup";
import ProductsCatalog from "@/components/ProductsCatalog/ProductsCatalog";

import type { Producer } from "@/types/Producer";
import allProducers from "@/data/producers";
import Dropdown from "@/components/ui/Dropdown/Dropdown";

interface CatalogProps {
  params: Promise<{ uf: string }>;
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
  const { uf } = use(params);
  const normalizedUf = uf.toUpperCase();

  const producersByUf = useMemo(
    () => allProducers.filter((p) => p.locality.state === normalizedUf),
    [normalizedUf]
  );

  const filterData = useMemo(
    () => getUniqueFilters(producersByUf),
    [producersByUf]
  );

  const desiredGenderOrder = ["female", "male", "femaletrans"];
  const genderFilters = useMemo(() => {
    const rawGenderFilters = getUniqueGenders(producersByUf);
    return rawGenderFilters.sort(
      (a, b) => desiredGenderOrder.indexOf(a) - desiredGenderOrder.indexOf(b)
    );
  }, [producersByUf]);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | "femaletrans" | null
  >("female");

  const [sortOption, setSortOption] = useState<
    "name" | "price" | "rating" | null
  >(null);

  function genderDisplayName(gender: string) {
    switch (gender) {
      case "female":
        return "Mulheres";
      case "male":
        return "Homens";
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

  const sortedProducers = useMemo(() => {
    const sorted = [...filteredProducers];

    switch (sortOption) {
      case "name":
        sorted.sort((a, b) => a.profile.name.localeCompare(b.profile.name));
        break;

      case "price":
        sorted.sort(
          (a, b) => (a.prices?.[1]?.price || 0) - (b.prices?.[1]?.price || 0)
        );
        break;

      case "rating":
        sorted.sort((a, b) => {
          const avgA =
            a.reviews && a.reviews.length
              ? a.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                a.reviews.length
              : null;
          const avgB =
            b.reviews && b.reviews.length
              ? b.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                b.reviews.length
              : null;

          if (avgA !== null && avgB !== null) {
            return avgB - avgA;
          }

          if (avgA === null && avgB !== null) return 1;
          if (avgA !== null && avgB === null) return -1;

          return 0;
        });
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProducers, sortOption]);

  const selectorRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    if (!selectorRef.current) return;
    const buttons = Array.from(
      selectorRef.current.querySelectorAll<HTMLButtonElement>("button")
    );
    const index = selectedGender ? genderFilters.indexOf(selectedGender) : -1;
    const btn = buttons[index];

    if (btn) {
      setHighlightStyle({
        width: btn.offsetWidth,
        left: btn.offsetLeft,
      });
    }
  }, [selectedGender, genderFilters]);

  function getSortLabel(option: typeof sortOption) {
    switch (option) {
      case "name":
        return "Nome";
      case "price":
        return "Preço";
      case "rating":
        return "Avaliação";
      default:
        return "Ordenar";
    }
  }

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
      <div className={styles.welcomeText}>
        <p>
          Encontre{" "}
          <span className={styles.gender}>
            {" "}
            {selectedGender ? genderDisplayName(selectedGender) : "todos"}
          </span>{" "}
          acompanhantes em <span className={styles.uf}>{uf}</span>
        </p>
      </div>
      <div className={styles.productsOptions}>
        <FilterPopup
          filters={filterData}
          currentSelectedFilters={selectedFilters}
          onApplyFilters={applyFilters}
          onClearAllFilters={clearAllFilters}
          producers={producersByUf}
        />
        <Dropdown
          trigger={<span>{getSortLabel(sortOption)}</span>}
          containerClassName=""
          triggerClassName={styles.orderTrigger}
          menuClassName={styles.orderMenu}
        >
          <button onClick={() => setSortOption("name")}>Nome</button>
          <button onClick={() => setSortOption("price")}>Preço</button>
          <button onClick={() => setSortOption("rating")}>Avaliação</button>
        </Dropdown>
      </div>
      <ProductsCatalog producers={sortedProducers} />
    </div>
  );
}
