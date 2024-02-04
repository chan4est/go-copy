import Image from 'next/image';
import rightBorder from '../../public/border-right.webp';
import styles from './Border.module.css';

export function RightBorder() {
  return (
    <Image
      src={rightBorder}
      className={`${styles.border} ${styles['right-border']}`}
      alt=""
    />
  );
}
