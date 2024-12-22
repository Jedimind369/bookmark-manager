export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FilterProps {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
} 