import GoCopy from './go-copy.js';
import { KofiButton } from 'react-kofi-button';

export default function Home() {
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  return (
    <main>
      <GoCopy />
      <footer>
        <a href="/" title="Home">
          Home
        </a>{' '}
        |{' '}
        {/* <a href="" title="Privacy Policy">
          Privacy Policy
        </a>{' '}
        |{' '} */}
        <a href="/about" title="Contact">
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
          {currentYear} © Chandler Forrest.
          <br></br>
          All rights reserved by their respective owners.
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
      </footer>
    </main>
  );
}
