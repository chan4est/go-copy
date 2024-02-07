'use client';

import { pokemonData } from './lib/pokemon';
import { missingPokemon } from './lib/missing-pokemon';
import { languageData } from './lib/languages';
import { Borders } from './components/Borders';
import backButton from '../public/btn-back.webp';
import questionButton from '../public/btn-question.webp';
import Image from 'next/image';
import copy from 'copy-to-clipboard';

import { useEffect, useRef, useState } from 'react';

function Pokemon({
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
      className="pokemon-grid-item"
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
        <Pokemon
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

  let className = 'search-icon';
  if (screenWasChanged && wasFocused) {
    className = 'search-icon-left';
  } else if (wasFocused) {
    className = 'search-icon-translated';
  }

  return (
    <div className="searchbar-container-container">
      <div className="searchbar-container">
        <CopyPopup popupText={popupText} popupKey={popupKey} />
        <div
          className="searchbar"
          title="Search by a Pokémon's English name or by their dex number"
        >
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onFocus={handleFocus}
          />
          <Image
            src={`/icon-search.webp`}
            className={className}
            alt={''}
            height={20}
            width={20}
            quality={100}
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
}

function InstructionsBar({
  languageCode,
  setScreenSelection,
  setPopupText,
  setScreenWasChanged,
}) {
  function handleClick() {
    setScreenSelection(2);
    // Clear so popup doesn't happen after language selection
    setPopupText(null);
    // Set flag for screen changing so search animation doesn't play again
    setScreenWasChanged(true);
  }

  return (
    <p className="instructions">
      TAP TO COPY POKE&#769;MON&apos;S
      <button
        className="language-chosen-btn"
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

function LanguageButton({
  languageCode,
  languageName,
  setLanguageCode,
  setScreenSelection,
}) {
  function handleClick() {
    setLanguageCode(languageCode);
    setScreenSelection(0);
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

function LanguageSelection({
  setLanguageCode,
  screenSelection,
  setScreenSelection,
}) {
  const languageList = Object.entries(languageData).map(
    ([languageCode, languageName]) => {
      return (
        <LanguageButton
          key={languageCode}
          languageCode={languageCode}
          languageName={languageName}
          setLanguageCode={setLanguageCode}
          setScreenSelection={setScreenSelection}
        />
      );
    }
  );
  return (
    <div
      className="language-selection"
      style={{ display: screenSelection == 2 ? 'grid' : 'none' }}
    >
      <div className="instructions language-instructions ">
        CHOOSE YOUR NICKNAMING LANGUAGE
      </div>
      {languageList}
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

function Tutorial({ screenSelection, setScreenSelection }) {
  return (
    <div
      id="tutorial-visibility"
      style={{ display: screenSelection == 1 ? '' : 'none' }}
    >
      <BackButton setScreenSelection={setScreenSelection} />
      <div className="tutorial">
        <u>TUTORIAL</u>
        <p>
          1. Search or scroll to the Pokémon <br></br>you want to nickname.
        </p>
        <div className="tutorial-container-s1-container">
          <div className="tutorial-container-s1">
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
            <div className="grid-item">
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
    </div>
  );
}

function QuestionButton({
  setPopupText,
  setScreenSelection,
  setScreenWasChanged,
}) {
  function handleClick() {
    setScreenSelection(1);
    setScreenWasChanged(true);
    // Clear so popup doesn't happen after language selection
    setPopupText(null);
  }
  return (
    <div id="question-button">
      <button onClick={handleClick} className="help-btn" title="Tutorial">
        <Image
          src={questionButton}
          height={70}
          width={70}
          alt=""
          quality={100}
          unoptimized={true}
        />
      </button>
    </div>
  );
}

function BackButton({ setScreenSelection }) {
  function handleClick() {
    setScreenSelection(0);
  }
  return (
    <div id="back-button">
      <button onClick={handleClick} className="back-btn" title="Exit">
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

// ChatGPT 3.5
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Add a scroll event listener to track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down a certain amount
      const scrollY = window.scrollY;
      const scrollThreshold = 500; // Adjust this threshold as needed
      setIsVisible(scrollY > scrollThreshold);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll back to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth scrolling effect
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-up-btn"
          title="Go back to the top"
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

function MainContent({ languageCode, screenSelection, setScreenSelection }) {
  const [popupText, setPopupText] = useState(null);
  const [popupKey, setPopupKey] = useState(0);
  const [searchValue, setSearchValue] = useState(null);
  const [screenWasChanged, setScreenWasChanged] = useState(false);

  return (
    <div style={{ display: screenSelection == 0 ? '' : 'none' }}>
      <ScrollToTopButton />
      <QuestionButton
        setPopupText={setPopupText}
        setScreenSelection={setScreenSelection}
        setScreenWasChanged={setScreenWasChanged}
      />
      <InstructionsBar
        languageCode={languageCode}
        setScreenSelection={setScreenSelection}
        setPopupText={setPopupText}
        setScreenWasChanged={setScreenWasChanged}
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
    </div>
  );
}

export default function FilterablePokedex() {
  const [languageCode, setLanguageCode] = useState('JA');
  // 0 => Main, 1 => Tutorial, 2 => Language Selection
  const [screenSelection, setScreenSelection] = useState(0);

  return (
    <>
      <Borders />
      <LanguageSelection
        setLanguageCode={setLanguageCode}
        screenSelection={screenSelection}
        setScreenSelection={setScreenSelection}
      />
      <Tutorial
        screenSelection={screenSelection}
        setScreenSelection={setScreenSelection}
      />
      <MainContent
        languageCode={languageCode}
        screenSelection={screenSelection}
        setScreenSelection={setScreenSelection}
      />
    </>
  );
}
