import Image from 'next/image';
import rightBorder from '../../public/right-border.jpg';
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
