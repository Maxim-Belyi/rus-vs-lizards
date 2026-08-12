import styles from "./RotateDevice.module.scss";

export function RotateDevice() {
  return (
    <div className={styles.rotateDeviceContainer}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <h2 className={styles.title}>Поверните устройство</h2>
      <p className={styles.description}>
        Игра "Русы против Ящеров" лучше всего работает в горизонтальном (landscape) режиме.
        Пожалуйста, переверните ваш телефон или планшет для комфортной игры.
      </p>
    </div>
  );
}
