'use client';

import { pokemonData } from './lib/pokemon.js';
import { languageData } from './lib/languages.js';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import leftBorder from '../public/left-border.jpg';
import rightBorder from '../public/right-border.jpg';
import { useRef, useState } from 'react';

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
        alt={'Image of the Poka&#769;mon ' + nameEnglish}
        height={256}
        width={256}
        quality={100}
      />
      <div className="pokemon-en-text">{nameEnglish}</div>
      <div className="pokemon-forign-text">{nameForeign}</div>
    </button>
  );
}

function PokemonTable({
  setPopupText,
  searchValue,
  setPopupKey,
  languageCode,
}) {
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
  const inputRef = useRef(null);

  return (
    <div className="searchbar-container">
      <CopyPopup popupText={popupText} popupKey={popupKey} />
      <div className="searchbar">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );
}

function TopBarContainer({
  popupText,
  popupKey,
  setSearchValue,
  languageCode,
}) {
  return (
    <div className="topbar-container">
      TAP TO COPY POKE&#769;MON&apos;S
      <button className="lang-selector">
        {languageData[languageCode].toUpperCase()}
      </button>
      <br></br>
      NAME ONTO YOUR CLIPBOARD
      <SearchBar
        popupText={popupText}
        popupKey={popupKey}
        setSearchValue={setSearchValue}
      />
    </div>
  );
}

function LanguageSelection({ setLangaugeCode }) {
  return <></>;
}

function LeftBorder() {
  return <Image src={leftBorder} className={'left-background'} alt="" />;
}

function RightBorder() {
  return <Image src={rightBorder} className={'right-background'} alt="" />;
}

export default function FilterablePokedex() {
  const [popupText, setPopupText] = useState(null);
  const [popupKey, setPopupKey] = useState(0);
  const [searchValue, setSearchValue] = useState(null);
  const [languageCode, setLangaugeCode] = useState('JA');

  return (
    <>
      <LeftBorder />
      <RightBorder />
      <LanguageSelection setLangaugeCode={setLangaugeCode} />
      <TopBarContainer
        popupText={popupText}
        popupKey={popupKey}
        setSearchValue={setSearchValue}
        languageCode={languageCode}
      />
      <PokemonTable
        setPopupText={setPopupText}
        setPopupKey={setPopupKey}
        searchValue={searchValue}
        languageCode={languageCode}
      />
    </>
  );
}
