import styles from './KofiButton.module.css';
import KofiCup from '../../public/kofi-cup.webp';
import Image from 'next/image';

/* Ripped from Kofi's official button and made into a Next.js compatible React component */
export default function KofiButton() {
  return (
    <div
      className={styles['btn-container']}
      title="Help me pay for server costs!"
    >
      <a className={styles['kofi-button']} href="https://ko-fi.com/chan4est">
        <span className={styles['kofi-text']}>
          <Image
            src={KofiCup}
            height={14}
            width={22}
            alt="Ko-fi donations"
            className={`${styles['kofi-img']}`}
            quality={100}
          />
          Support me on Ko-fi
        </span>
      </a>
    </div>
  );
}
