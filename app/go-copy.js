'use client';

import { pokemonData } from './lib/pokemon.js';
import { languageData } from './lib/languages.js';
import { LeftBorder } from './components/LeftBorder';
import { RightBorder } from './components/RightBorder';
import backButton from '../public/btn-back.png';
import Image from 'next/image';
import copy from 'copy-to-clipboard';

import { useState, useEffect } from 'react';

function Pokemon({
  nameEnglish,
  nameForeign,
  sprite_image,
  pokemonNumber,
  setPopupText,
  setPopupKey,
}) {
  function handleClick() {
    copy(nameForeign);
    setPopupText(nameForeign);
    setPopupKey((prevID) => prevID + 1);
  }

  // HACK: Invisible Pokemon to fill in the CSS grid
  const style = pokemonNumber < 0 ? 'hidden' : 'visible';

  return (
    <button
      className="pokemon-grid-item"
      onClick={() => handleClick()}
      style={{ visibility: style }}
    >
      <Image
        src={`/pokemon-images/${Math.abs(pokemonNumber)}.webp`}
        // src={sprite_image}
        alt={'Image of the Pokémon ' + nameEnglish}
        height={256}
        width={256}
        quality={100}
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
        (pokemon) => pokemon.id == Number(searchValue) || pokemon.id < 0
      );
    } else {
      const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
      filteredPokemon = pokemonData.filter(
        (pokemon) =>
          pokemon.name_EN.toLowerCase().match(searchRegex) != null ||
          pokemon.id < 0
      );
    }
  }
  let pokemonList = filteredPokemon.map((pokemon) => {
    return (
      <Pokemon
        key={pokemon.id}
        nameEnglish={pokemon.name_EN}
        nameForeign={pokemon[`name_${languageCode}`]}
        sprite_image={pokemon.sprite_image}
        pokemonNumber={pokemon.id}
        setPopupText={setPopupText}
        setPopupKey={setPopupKey}
      />
    );
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

function SearchBar({ popupText, popupKey, setSearchValue }) {
  return (
    <div className="searchbar-container">
      <CopyPopup popupText={popupText} popupKey={popupKey} />
      <div className="searchbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );
}

function InstructionsBar({ languageCode, setIsMainVisible, setPopupText }) {
  function handleClick() {
    setIsMainVisible(false);
    // Clear so popup doesn't happen after language selection
    setPopupText(null);
  }

  return (
    <p className="instructions">
      TAP TO COPY POKE&#769;MON&apos;S
      <button className="language-chosen-btn" onClick={handleClick}>
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
  setIsMainVisible,
}) {
  function handleClick() {
    setLanguageCode(languageCode);
    setIsMainVisible(true);
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
    <button onClick={handleClick} className="language-option-btn ">
      {format(languageName)}
    </button>
  );
}

function LanguageSelection({
  setLanguageCode,
  isMainVisible,
  setIsMainVisible,
}) {
  const languageList = Object.entries(languageData).map(
    ([languageCode, languageName]) => {
      return (
        <LanguageButton
          key={languageCode}
          languageCode={languageCode}
          languageName={languageName}
          setLanguageCode={setLanguageCode}
          setIsMainVisible={setIsMainVisible}
        />
      );
    }
  );
  return (
    <div
      className="language-selection"
      style={{ display: !isMainVisible ? 'grid' : 'none' }}
    >
      <div className="instructions language-instructions ">
        CHOOSE YOUR NICKNAMING LANGUAGE
      </div>
      {languageList}
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
        <button onClick={scrollToTop} className="scroll-up-btn">
          <Image src={backButton} height={50} width={50} alt="" />
        </button>
      )}
    </div>
  );
}

function MainContent({ languageCode, isMainVisible, setIsMainVisible }) {
  const [popupText, setPopupText] = useState(null);
  const [popupKey, setPopupKey] = useState(0);
  const [searchValue, setSearchValue] = useState(null);

  return (
    <div style={{ display: isMainVisible ? '' : 'none' }}>
      <ScrollToTopButton />
      <InstructionsBar
        languageCode={languageCode}
        setIsMainVisible={setIsMainVisible}
        setPopupText={setPopupText}
      />
      <SearchBar
        popupText={popupText}
        popupKey={popupKey}
        setSearchValue={setSearchValue}
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
  const [isMainVisible, setIsMainVisible] = useState(true);

  return (
    <>
      <LeftBorder />
      <RightBorder />
      <LanguageSelection
        setLanguageCode={setLanguageCode}
        isMainVisible={isMainVisible}
        setIsMainVisible={setIsMainVisible}
      />
      <MainContent
        languageCode={languageCode}
        isMainVisible={isMainVisible}
        setIsMainVisible={setIsMainVisible}
      />
    </>
  );
}
