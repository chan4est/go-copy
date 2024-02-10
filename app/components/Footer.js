import { KofiButton } from 'react-kofi-button';
import styles from './Footer.module.css';

export default function Footer({ footerRef }) {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  return (
    <footer className={styles['footer']} ref={footerRef}>
      <div className={styles['footer-container']}>
        <a href="/" title="Home" className={styles['footer-a']}>
          Home
        </a>{' '}
        |{' '}
        {/* <a href="/" title="Privacy Policy" className={styles['footer-a']}>
          Privacy Policy
        </a>{' '}
        |{' '} */}
        <a href="/about" title="Contact" className={styles['footer-a']}>
          {' '}
          Contact
        </a>
        <br></br>
        <br></br>
        <KofiButton
          username="chan4est"
          title="Help me pay for server costs!"
          label="SUPPORT ME!"
          preset="skinny"
          backgroundColor="#4fa283"
          animation="false"
        />
        <br></br>
        <br></br>
        <p>
          {currentYear} © Chandler Forrest. All rights reserved by their
          respective owners.
          <br></br>
          This website is not officially affiliated with Pokémon GO and is
          intended to fall under Fair Use doctrine, similar to any other
          informational site such as a wiki.
          <br></br>
          Pokémon and its trademarks are © 1995 - {currentYear}{' '}
          Nintendo/Creatures Inc./GAME FREAK inc.
          <br></br>
          All images and names owned and trademarked by Nintendo, Niantic, Inc.,
          The Pokémon Company, and GAMEFREAK are property of their respective
          owners.
        </p>
      </div>
    </footer>
  );
}
