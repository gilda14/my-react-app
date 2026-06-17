import styles from "./IncreaseButton.module.css";

type IncreaseButtonProps = {
  onChange: () => void;
};

export default function IncreaseButton({ onChange }: IncreaseButtonProps) {
  return (
    <button
      type="button"
      className={styles["Increase-button"]}
      onClick={onChange}
    >
      +
    </button>
  );
}
