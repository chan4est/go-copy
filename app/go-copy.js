'use client';

import { pokemonData } from './lib/pokemon';
import { missingPokemon } from './lib/missing-pokemon';
import { languageData } from './lib/languages';
import Borders from './components/Borders';
import Footer from './components/Footer';
import backButton from '../public/btn-back.webp';
import questionButton from '../public/btn-question.webp';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useScrollBlock } from './components/useScrollBlock';
import copy from 'copy-to-clipboard';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Pokemon Grid

function PokemonButton({
  nameEnglish,
  nameForeign,
  pokemonNumber,
  setPopupText,
  setPopupKey,
}) {
  function handleClick() {
    copy(nameForeign);
    setPopupText(nameForeign);
    setPopupKey((prevID) => prevID + 1);
  }

  return (
    <button
      className="pokemon-grid-btn"
      onClick={() => handleClick()}
      title={`Copy ${nameForeign}`}
    >
      <Image
        src={`/pokemon-images/${pokemonNumber}.webp`}
        alt={'Image of the Pokémon ' + nameEnglish}
        height={256}
        width={256}
        quality={100}
        unoptimized={true}
      />
      <div className="pokemon-en-text">{nameEnglish}</div>
      <div className="pokemon-forign-text">{nameForeign}</div>
    </button>
  );
}

function PokemonGrid({ setPopupText, searchValue, setPopupKey, languageCode }) {
  // https://stackoverflow.com/a/175787/5221437
  function isNumber(str) {
    if (typeof str != 'string') return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  let filteredPokemon = pokemonData;
  // Can search by name or dex number
  if (searchValue) {
    if (isNumber(searchValue)) {
      filteredPokemon = pokemonData.filter(
        (pokemon) => pokemon.id == Number(searchValue)
      );
    } else {
      const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
      filteredPokemon = pokemonData.filter(
        (pokemon) => pokemon.name_EN.toLowerCase().match(searchRegex) != null
      );
    }
  }

  const pokemonList = filteredPokemon.map((pokemon) => {
    const nameForeign = pokemon[`name_${languageCode}`];
    // Don't show Pokemon that aren't in GO yet (Spoilers)
    if (!missingPokemon.includes(pokemon.id)) {
      return (
        <PokemonButton
          key={pokemon.id}
          nameEnglish={pokemon.name_EN}
          nameForeign={nameForeign}
          pokemonNumber={pokemon.id}
          setPopupText={setPopupText}
          setPopupKey={setPopupKey}
        />
      );
    }
  });

  return (
    <div className="pokemon-grid-container">
      <div className="pokemon-grid">{pokemonList}</div>
    </div>
  );
}

// Search Bar

function CopyPopup({ popupText, popupKey }) {
  // https://stackoverflow.com/a/63194757/5221437
  // Re-renders every time a Pokemon is clicked
  return (
    <div
      key={popupKey}
      className={popupText ? 'copy-popup popup-animation' : 'copy-popup'}
    >
      {popupText} COPIED
    </div>
  );
}

function SearchBar({ popupText, popupKey, setSearchValue, screenWasChanged }) {
  const [wasFocused, setWasFocused] = useState(false);

  const handleFocus = () => {
    setWasFocused(true);
  };

  let backgroundClassName = '';
  if (screenWasChanged && wasFocused) {
    backgroundClassName = 'search-input-background-left';
  } else if (wasFocused) {
    backgroundClassName = 'search-input-background-animation';
  }

  return (
    <div className="searchbar-container">
      <div className="searchbar-grid">
        <CopyPopup popupText={popupText} popupKey={popupKey} />
        <div
          className="searchbar"
          title="Search by a Pokémon's English name or by their dex number"
        >
          <input
            className={`search-input ${backgroundClassName}`}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onFocus={handleFocus}
          />
        </div>
      </div>
    </div>
  );
}

// Main Screen Instructions

function InstructionsBar({
  languageCode,
  setPopupText,
  setScreenWasChanged,
  setLanguageModalOpen,
  blockHomeScroll,
}) {
  function handleClick() {
    // Clear so popup doesn't happen after language selection
    setPopupText(null);
    // Set flag for screen changing so search animation doesn't play again
    setScreenWasChanged(true);
    setLanguageModalOpen(true);
    // Block home scrolling since we're going to the Instructions Screen
    blockHomeScroll();
  }

  return (
    <p className="instructions">
      TAP TO COPY POKE&#769;MON&apos;S
      <button
        className="instructions-lang-change-btn"
        onClick={handleClick}
        title={'Change nicknaming language'}
      >
        {/* Split for Chinese (Simplified/Tradition) */}
        {languageData[languageCode].split(' ')[0].toUpperCase()}
      </button>
      <br></br>
      NAME ONTO YOUR CLIPBOARD
    </p>
  );
}

// Main Screen Buttons

function QuestionButton({
  setPopupText,
  setTutorialModalOpen,
  blockHomeScroll,
  footerHeight,
}) {
  /* ChatGPT 3.5 */
  const [isNearFooter, setIsNearFooter] = useState(false);

  // Add a scroll event listener to track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down a certain amount
      const scrollY = window.scrollY;
      const footerOffset =
        document.body.scrollHeight - window.innerHeight - footerHeight * 0.85;

      // console.log(`scrollY ${scrollY}`);
      // console.log(`footerOffset ${footerOffset}`);
      // console.log(`isNearFooter ${isNearFooter}`);
      setIsNearFooter(scrollY > footerOffset);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNearFooter, footerHeight]);

  function openTutorial() {
    setTutorialModalOpen(true);
    // Clear so popup doesn't happen after language selection
    setPopupText(null);
    // Block home scrolling since we're going to the Tutorial Screen
    blockHomeScroll();
  }

  return (
    <div id="question-button">
      {!isNearFooter && (
        <button
          onClick={openTutorial}
          className={'circular-btn help-btn'}
          title="Tutorial"
          style={isNearFooter ? footerCSS : {}}
        >
          <Image
            src={questionButton}
            height={70}
            width={70}
            alt=""
            quality={100}
            unoptimized={true}
          />
        </button>
      )}
    </div>
  );
}

function ScrollToTopButton({ footerHeight }) {
  /* ChatGPT 3.5 */
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  // Add a scroll event listener to track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down a certain amount
      const scrollY = window.scrollY;
      const footerOffset =
        document.body.scrollHeight - window.innerHeight - footerHeight * 0.05; // Adjust 200 as per your footer's height
      const scrollThreshold = 500; // Adjust this threshold as needed

      // console.log(`scrollY ${scrollY}`);
      // console.log(`document.body.screenHeight ${document.body.scrollHeight}`);
      // console.log(`window.innerHeight ${window.innerHeight}`);
      // console.log(`footerHeight ${footerHeight}`);
      // console.log(`footerOffset ${footerOffset}`);
      // console.log(`isNearFooter ${isNearFooter}`);

      setIsVisible(scrollY > scrollThreshold);
      setIsNearFooter(scrollY > footerOffset);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNearFooter, footerHeight]);

  // Function to scroll back to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth scrolling effect
    });
  };

  const footerCSS = {
    bottom: `calc(3% + ${footerHeight}px)`,
  };

  return (
    <div id="scroll-to-top-button">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`circular-btn scroll-up-btn`}
          title="Go back to the top"
          style={isNearFooter ? footerCSS : {}}
        >
          <Image
            src={backButton}
            height={50}
            width={50}
            alt=""
            quality={100}
            unoptimized={true}
          />
        </button>
      )}
    </div>
  );
}

// Main Screen

function HomeScreen({
  languageCode,
  setLanguageModalOpen,
  setTutorialModalOpen,
  blockHomeScroll,
}) {
  // Change the text every time a NEW Pokemon is clicked on so the new text is displayed
  const [popupText, setPopupText] = useState(null);
  // Change the key every time a Pokemon is clicked on so the notif pops up again
  const [popupKey, setPopupKey] = useState(0);
  // Filtering what Pokemon are shown in the grid
  const [searchValue, setSearchValue] = useState(null);
  // False = 🔎 icon is in the middle, True = 🔎 icon is on the left
  const [screenWasChanged, setScreenWasChanged] = useState(false);
  // Keeping track of footer height so we can move align the buttons perfectly above it
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight;
        setFooterHeight(height);
        console.log(`footer height ${height}`);
      }
    }

    handleResize(); // Call it initially to get the height
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [footerRef]);

  return (
    <div>
      <Borders />
      <ScrollToTopButton footerHeight={footerHeight} />
      <QuestionButton
        setPopupText={setPopupText}
        setTutorialModalOpen={setTutorialModalOpen}
        blockHomeScroll={blockHomeScroll}
        footerHeight={footerHeight}
      />
      <InstructionsBar
        languageCode={languageCode}
        setPopupText={setPopupText}
        setScreenWasChanged={setScreenWasChanged}
        setLanguageModalOpen={setLanguageModalOpen}
        blockHomeScroll={blockHomeScroll}
      />
      <SearchBar
        popupText={popupText}
        popupKey={popupKey}
        setSearchValue={setSearchValue}
        screenWasChanged={screenWasChanged}
      />
      <PokemonGrid
        setPopupText={setPopupText}
        setPopupKey={setPopupKey}
        searchValue={searchValue}
        languageCode={languageCode}
      />
      <Footer footerRef={footerRef} />
    </div>
  );
}

// Tutorial

function BackButton({ setTutorialModalOpen, allowHomeScroll }) {
  function handleClick() {
    setTutorialModalOpen(false);
    allowHomeScroll();
  }
  return (
    <div id="back-button">
      <button
        onClick={handleClick}
        className="circular-btn back-btn"
        title="Home"
      >
        <Image
          src={backButton}
          height={50}
          width={50}
          alt=""
          quality={100}
          unoptimized={true}
        />
      </button>
    </div>
  );
}

function TutorialImage({ imagePath, width, height }) {
  return (
    <Image
      src={imagePath}
      alt={''}
      width={width}
      height={height}
      quality={100}
      unoptimized={true}
    />
  );
}

function TutorialScreen({
  tutorialModalOpen,
  setTutorialModalOpen,
  allowHomeScroll,
}) {
  function handleClose() {
    setTutorialModalOpen(false);
  }
  return (
    <Modal
      isOpen={tutorialModalOpen}
      onRequestClose={handleClose}
      className="modal-content modal-content-100"
      overlayClassName="modal-overlay"
    >
      <Borders />
      <BackButton
        setTutorialModalOpen={setTutorialModalOpen}
        allowHomeScroll={allowHomeScroll}
      />
      <div className="tutorial">
        <u>TUTORIAL</u>
        <p>
          1. Search or scroll to the Pokémon <br></br>you want to nickname.
        </p>
        <div className="tutorial-s1-container">
          <div className="tutorial-s1-grid">
            <div>
              <TutorialImage
                imagePath={'/tutorial/tut1.webp'}
                width={162}
                height={265}
              />
              <p className="tipText">Filter by name...</p>
            </div>
            <div>
              <TutorialImage
                imagePath={'/tutorial/tut2.webp'}
                width={162}
                height={265}
                tipText={'or dex number!'}
              />
              <p className="tipText">or dex number!</p>
            </div>
            <div className="tutorial-s1-grid-item">
              <TutorialImage
                imagePath={'/tutorial/tut3.webp'}
                width={162}
                height={215}
              />
              <p className="tipText">
                Scroll quickly <br></br>using your <br></br>browser&#39;s{' '}
                <br></br>
                scroll bar!
              </p>
            </div>
          </div>
        </div>
        <p>
          2. Tap on the Pokémon to automatically <br></br>put the foreign name
          into your clipboard.
        </p>
        <TutorialImage
          imagePath={'/tutorial/tut4.webp'}
          width={326}
          height={556}
        />
        <p>3. Switch apps to Pokémon GO.</p>
        <TutorialImage
          imagePath={'/tutorial/tut5.webp'}
          width={326}
          height={531}
        />
        <p>4. Paste in your new nickname.</p>
        <TutorialImage
          imagePath={'/tutorial/tut6.webp'}
          width={326}
          height={440}
        />
        <p>Done!</p>
        <TutorialImage
          imagePath={'/tutorial/tut7.webp'}
          width={326}
          height={403}
        />
        <p>
          TIP! You can choose other nicknaming <br></br>languages from the
          dropdown menu at <br></br>the top of the screen.
        </p>
        <TutorialImage
          imagePath={'/tutorial/tut8.webp'}
          width={326}
          height={435}
        />
      </div>
      <Footer />
    </Modal>
  );
}

// Language Selection Screen

function LanguageOptionButton({
  languageCode,
  languageName,
  setLanguageCode,
  setLanguageModalOpen,
  allowHomeScroll,
}) {
  function handleClick() {
    setLanguageCode(languageCode);
    setLanguageModalOpen(false);
    allowHomeScroll();
  }

  function format(languageName) {
    if (languageName.includes('Chinese')) {
      const [name, specifier] = languageName.split(' ');
      return (
        <>
          {name} <small> {`${specifier}`} </small>
        </>
      );
    }
    return <>{languageName}</>;
  }

  return (
    <button
      onClick={handleClick}
      className="language-option-btn"
      title={`Change nicknaming language to ${languageName}`}
    >
      {format(languageName)}
    </button>
  );
}

function LanguageSelectionScreen({
  setLanguageCode,
  languageModalOpen,
  setLanguageModalOpen,
  allowHomeScroll,
}) {
  function handleClose() {
    setLanguageModalOpen(false);
  }

  const languageList = Object.entries(languageData).map(
    ([languageCode, languageName]) => {
      return (
        <LanguageOptionButton
          key={languageCode}
          languageCode={languageCode}
          languageName={languageName}
          setLanguageCode={setLanguageCode}
          setLanguageModalOpen={setLanguageModalOpen}
          allowHomeScroll={allowHomeScroll}
        />
      );
    }
  );

  return (
    <Modal
      isOpen={languageModalOpen}
      onRequestClose={handleClose}
      className="modal-content modal-content-100"
      overlayClassName="modal-overlay"
    >
      <Borders />
      <div className={`language-selection-grid`}>
        <div className="instructions language-selection-instructions">
          CHOOSE YOUR NICKNAMING LANGUAGE
        </div>
        {languageList}
      </div>
      <Footer />
    </Modal>
  );
}

export default function App() {
  // User's selected nicknaming language. For displaying in the tooltip bar and what's in the Pokemon grid
  const [languageCode, setLanguageCode] = useState('JA');
  // Keeping track of which non-home screen is open
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  // So scrolling on a popup screen doesn't effect the Home screen
  const [blockHomeScroll, allowHomeScroll] = useScrollBlock();

  return (
    <div>
      <LanguageSelectionScreen
        setLanguageCode={setLanguageCode}
        languageModalOpen={languageModalOpen}
        setLanguageModalOpen={setLanguageModalOpen}
        allowHomeScroll={allowHomeScroll}
      />
      <TutorialScreen
        tutorialModalOpen={tutorialModalOpen}
        setTutorialModalOpen={setTutorialModalOpen}
        allowHomeScroll={allowHomeScroll}
      />
      <HomeScreen
        languageCode={languageCode}
        setLanguageModalOpen={setLanguageModalOpen}
        setTutorialModalOpen={setTutorialModalOpen}
        blockHomeScroll={blockHomeScroll}
        allowHomeScroll={allowHomeScroll}
      />
    </div>
  );
}
