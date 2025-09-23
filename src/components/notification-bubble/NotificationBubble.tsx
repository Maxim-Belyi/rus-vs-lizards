import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import styles from "./Bubble.module.scss";

interface NotificationBubbleProps {
  message: string | null;
}

export function NotificationBubble({ message }: NotificationBubbleProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          className={clsx(styles.bubble)}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
