import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: InputProps) {
  return (
    <input
      type={type}
      className={styles.input}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
