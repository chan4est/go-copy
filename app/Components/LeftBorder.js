import Image from 'next/image';
import leftBorder from '../../public/left-border.jpg';
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
