import Image from 'next/image';
import leftBorder from '../../public/border-left.webp';
import styles from './Border.module.css';

export function LeftBorder() {
  return (
    <Image
      src={leftBorder}
      className={`${styles.border} ${styles['left-border']}`}
      alt=""
    />
  );
}
