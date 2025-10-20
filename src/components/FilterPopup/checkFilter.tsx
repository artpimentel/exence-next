import styles from "./FilterPopup.module.css";

interface CheckFilterProps {
  filter: {
    category: string;
    options?: string[];
  };
  selectedFilters: Record<string, string[]>;
  onToggleFilter: (category: string, option: string) => void;
}

export default function CheckFilter({
  filter,
  selectedFilters,
  onToggleFilter,
}: CheckFilterProps) {
  return (
    <div className={styles.filterOptions}>
      {filter.options?.map((option) => {
        const isChecked =
          selectedFilters[filter.category]?.includes(option) || false;

        return (
          <label key={option} className={styles.filterOption}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggleFilter(filter.category, option)}
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}
