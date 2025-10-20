"use client";

import { Range } from "react-range";
import styles from "./FilterPopup.module.css";

interface RangeValue {
  min: number;
  max: number;
}

interface RangeFilterProps {
  filter: {
    category: string;
    label: string;
    unit?: string;
  };
  rangeValues: Record<string, RangeValue>;
  setRangeValues: React.Dispatch<
    React.SetStateAction<Record<string, RangeValue>>
  >;
  ranges: Record<string, RangeValue>;
}

export default function RangeFilter({
  filter,
  rangeValues,
  setRangeValues,
  ranges,
}: RangeFilterProps) {
  const { category, unit } = filter;

  const current = rangeValues[category] || { min: 0, max: 100 };
  const bounds = ranges[category] || { min: 0, max: 100 };

  const rangeSpan = bounds.max - bounds.min;
  const step =
    rangeSpan <= 10 ? 0.1 : rangeSpan <= 100 ? 1 : Math.floor(rangeSpan / 50);

  const handleChange = (values: number[]) => {
    const [min, max] = values;
    setRangeValues((prev) => ({
      ...prev,
      [category]: { min, max },
    }));
  };

  return (
    <div className={styles.rangeFilter}>
      <Range
        step={step}
        min={bounds.min}
        max={bounds.max}
        values={[current.min, current.max]}
        onChange={handleChange}
        renderTrack={({ props, children }) => {
          const [minPercent, maxPercent] = [
            ((current.min - bounds.min) / (bounds.max - bounds.min)) * 100,
            ((current.max - bounds.min) / (bounds.max - bounds.min)) * 100,
          ];

          return (
            <div
              {...props}
              className={styles.rangeTrack}
              style={{
                background: `linear-gradient(
                    to right,
                    var(--contrast-color) ${minPercent}%,
                    var(--primary-color) ${minPercent}%,
                    var(--primary-color) ${maxPercent}%,
                    var(--contrast-color) ${maxPercent}%
                  )`,
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className={styles.rangeThumb}
            style={{
              ...props.style,
              backgroundColor: "var(--primary-color)",
            }}
          >
            <span className={styles.thumbLabel}>
              {index === 0 ? current.min : current.max}
              {unit ? ` ${unit}` : ""}
            </span>
          </div>
        )}
      />
    </div>
  );
}
