import Image from 'next/image';
import Borders from './Borders';
import Footer from './Footer';
import questionMark from '../../public/201-qm.webp';
import styles from './Error.module.css';

export default function Error({ errorText }) {
  return (
    <div className="generic-container">
      <div className="generic-content">
        <Borders />
        <div className={styles['error-grid-container']}>
          <div className={styles['error-grid']}>
            <Image
              src={questionMark}
              height={200}
              width={200}
              alt=""
              className={styles['question-image']}
              quality={100}
            />
            <h2>{errorText}</h2>
            <p>
              If you believe there is supposed to be something here,&nbsp;
              <a
                className={styles['error-a']}
                href="mailto:chan4est@gmail.com?subject=GO Copy! Issue&body=Please include screenshots of your screen and browser console if possible. Thank you!"
              >
                please email me
              </a>
              .
            </p>
            <p>
              Include details of what you did before encountering this error
              along with what you expected. Thank you!
            </p>
            <p>
              Go back to the{' '}
              <a className={styles['error-a']} href="/">
                Main Page
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
