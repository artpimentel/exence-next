"use client";

import { useState } from "react";
import styles from "./page.module.css";

import FilterPopup from "@/components/FilterPopup/FilterPopup";
import ProductsCatalog from "@/components/ProductsCatalog/ProductsCatalog";

import type { Producer } from "@/types/Producer";
import allProducers from "@/data/producers";

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

function Catalog() {
  const userPreferredGender = "female";

  const filterData = getUniqueFilters(allProducers);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const rawGenderFilters = getUniqueGenders(allProducers);

  const desiredGenderOrder = ["female", "male", "femaletrans"];
  const genderFilters = rawGenderFilters.sort(
    (a, b) => desiredGenderOrder.indexOf(a) - desiredGenderOrder.indexOf(b)
  );

  function applyFilters(newFilters: Record<string, string[]>) {
    setSelectedFilters(newFilters);
  }

  function clearAllFilters() {
    setSelectedFilters({});
    setSelectedGender(null);
  }

  const filteredProducers = allProducers.filter((producer) => {
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

  return (
    <div className={styles.layout}>
      <FilterPopup
        filters={filterData}
        currentSelectedFilters={selectedFilters}
        onApplyFilters={applyFilters}
        onClearAllFilters={clearAllFilters}
        producers={allProducers}
      />
      <ProductsCatalog producers={filteredProducers} />
    </div>
  );
}

export default Catalog;
