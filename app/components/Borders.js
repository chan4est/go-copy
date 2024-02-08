import Image from 'next/image';
import leftBorder from '../../public/border-left.webp';
import rightBorder from '../../public/border-right.webp';
import styles from './Borders.module.css';

export default function Borders() {
  return (
    <>
      <Image
        src={leftBorder}
        className={`${styles.border} ${styles['left-border']}`}
        alt=""
      />
      <Image
        src={rightBorder}
        className={`${styles.border} ${styles['right-border']}`}
        alt=""
      />
    </>
  );
}
