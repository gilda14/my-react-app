import styles from "./DecreaseButton.module.css";

type DecreaseButtonProps = {
  value: number;
  min?: number;
  onChange: () => void;
};

export default function DecreaseButton({
  value,
  min = 1,
  onChange,
}: DecreaseButtonProps) {
  return (
    <button
      type="button"
      className={styles["decrease-button"]}
      onClick={onChange}
      disabled={value <= min}
    >
      -
    </button>
  );
}
