import Link from 'next/link';
import Footer from '../components/Footer';
import Borders from '../components/Borders';
import styles from './about.module.css';
import chanPhoto from '../../public/me.webp';
import Image from 'next/image';
import KofiButton from '../components/KofiButton';

export default function About() {
  return (
    <div className="base-container">
      <div className="base-content">
        <Borders />
        <div className={styles['about-grid-container']}>
          <div className={styles['about-grid']}>
            <Image
              src={chanPhoto}
              alt={'Image of the owner and creator, Chandler!'}
              height={300}
              width={300}
              quality={100}
              unoptimized={true}
              className={styles['chan-image']}
            />
            <br></br>
            <p>
              My name is Chandler and I&#39;m a software developer from
              California who loves Pokémon! You can find more info about me on
              my website{' '}
              <Link className={styles['about-a']} href="https://chan4est.com">
                chan4est.com
              </Link>
              .
            </p>
            <br></br>
            <p>
              If you want to contact me about anything related to GO Copy{' '}
              <Link
                className={styles['about-a']}
                href="mailto:chan4est@gmail.com?subject=GO Copy!"
              >
                please email me
              </Link>
              . I&#39;ll make sure to respond as quickly as possible.
            </p>
            <br></br>
            <p>
              If you enjoy using this app, please consider supporting me on
              Ko-fi! I developed this website myself and pay for the server
              costs out of my own pocket. Any amount goes a long way!
            </p>
            <br></br>
            <KofiButton />
          </div>
        </div>
      </div>
      <Footer removeKofiButton={true} />
    </div>
  );
}
