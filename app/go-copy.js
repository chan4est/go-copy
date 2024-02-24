'use client';

import { languageData } from './lib/languages';
import { missingPokemon } from './lib/missing-pokemon';
import { pokemonCatagories } from './lib/pokemon-categories';
import { pokemonRegions } from './lib/pokemon-regions';
import { pokemonTypes } from './lib/pokemon-types';
import { pokemonData } from './lib/pokemon';

import Borders from './components/Borders';
import Footer from './components/Footer';
import { useScrollBlock } from './lib/useScrollBlock';

import backButton from '../public/btn-back.webp';
import backButtonRotated from '../public/btn-back-rot.webp';
import questionButton from '../public/btn-question.webp';
import ascendingButton from '../public/btn-number-down.webp';
import descendingButton from '../public/btn-number-up.webp';
import aZButton from '../public/btn-az.webp';
import zAButton from '../public/btn-za.webp';
import xButton from '../public/btn-x.webp';

import filterX from '../public/filter/filter-x.webp';
import clearX from '../public/filter/clear-x.webp';
import clearXLong from '../public/filter/clear-x-long.webp';
import doubleDeckerLine from '../public/filter/dd-line.webp';
import searchBack from '../public/filter/search-back.webp';

import bug from '../public/filter/type/bug.webp';
import dark from '../public/filter/type/dark.webp';
import dragon from '../public/filter/type/dragon.webp';
import electric from '../public/filter/type/electric.webp';
import fairy from '../public/filter/type/fairy.webp';
import fighting from '../public/filter/type/fighting.webp';
import fire from '../public/filter/type/fire.webp';
import flying from '../public/filter/type/flying.webp';
import ghost from '../public/filter/type/ghost.webp';
import grass from '../public/filter/type/grass.webp';
import ground from '../public/filter/type/ground.webp';
import ice from '../public/filter/type/ice.webp';
import normal from '../public/filter/type/normal.webp';
import poison from '../public/filter/type/poison.webp';
import psychic from '../public/filter/type/psychic.webp';
import rock from '../public/filter/type/rock.webp';
import steel from '../public/filter/type/steel.webp';
import water from '../public/filter/type/water.webp';
import baby from '../public/filter/special/baby.webp';
import fossil from '../public/filter/special/fossil.webp';
import gmax from '../public/filter/special/gmax.webp';
import legendary from '../public/filter/special/legendary.webp';
import mega from '../public/filter/special/mega.webp';
import mythical from '../public/filter/special/mythical.webp';
import paradox from '../public/filter/special/paradox.webp';
import pseudo from '../public/filter/special/psuedo.webp';
import starter from '../public/filter/special/starter.webp';
import ultraBeast from '../public/filter/special/ultra-beast.webp';
import caterpie from '../public/filter/special/bug.webp';
import bird from '../public/filter/special/bird.webp';
import rodent from '../public/filter/special/rodent.webp';
import pikaclone from '../public/filter/special/pikaclone.webp';
import regional from '../public/filter/special/regional.webp';
import alola from '../public/filter/region/alola.webp';
import galar from '../public/filter/region/galar.webp';
import hisui from '../public/filter/region/hisui.webp';
import hoenn from '../public/filter/region/hoenn.webp';
import johto from '../public/filter/region/johto.webp';
import kalos from '../public/filter/region/kalos.webp';
import kanto from '../public/filter/region/kanto.webp';
import paldea from '../public/filter/region/paldea.webp';
import sinnoh from '../public/filter/region/sinnoh.webp';
import unova from '../public/filter/region/unova.webp';
import unknown from '../public/filter/region/unknown.webp';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import copy from 'copy-to-clipboard';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Pokemon Grid

// searchValue: search string input by the user
//  ex: "kanto & fairy, +bulba, 150-151" ->  all Kanto Fairy types, Bulbasaur line, and Mewtwo + Mew
// filterTags: array of filters (defined in pokemon-categories.js) that the user has clicked on
//  ex: ['Legendary', 'Dragon', 'Hoenn', 'Flying'] -> Rayquaza
// sortingOrder: value 0-3 which determines what order to sort the results
function searchFilterAndSortPokemon(searchValue, filterTags, sortingOrder) {
  // https://stackoverflow.com/a/175787/5221437
  function isNumber(str) {
    if (typeof str != 'string') return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  function filterNot(pokemonToFilter, pokemonNotWanted) {
    return pokemonToFilter.filter(
      (pokemon) => !pokemonNotWanted.includes(pokemon)
    );
  }

  function filterThroughPokemon(pokemonToFilter, searchValue, isNegatedSearch) {
    let resultingFilteredPokemon = [];
    searchValue = searchValue.trim();
    // Searching by dex range (ex: 1-151 -> ALL of Kanto)
    if (searchValue.includes('-')) {
      const [start, end] = searchValue.split('-');
      if (isNumber(start) && isNumber(end)) {
        resultingFilteredPokemon = pokemonToFilter.filter(
          (pokemon) => pokemon.id >= start && pokemon.id <= end
        );
      }
    }
    // Searching by dex number (ex: 150 -> Mewtwo)
    else if (isNumber(searchValue)) {
      resultingFilteredPokemon = pokemonToFilter.filter(
        (pokemon) => pokemon.id == Number(searchValue)
      );
    }
    // Searching by family (ex: +Pikachu -> Pichu, Pikachu, Raichu)
    else if (searchValue[0] == '+') {
      const searchRegex = new RegExp(
        `^${searchValue.substring(1).toLowerCase()}.*`
      );
      resultingFilteredPokemon = pokemonToFilter.filter((pokemon) =>
        pokemon.family.some(
          (familyName) => familyName.match(searchRegex) != null
        )
      );
    }
    // Searching by type (ex: Dark -> Umbreon, Murkrow, etc..)
    else if (pokemonTypes.includes(searchValue.toLowerCase())) {
      resultingFilteredPokemon = pokemonToFilter.filter((pokemon) =>
        pokemon.types.includes(searchValue.toLowerCase())
      );
    }
    // Searching by region (ex: Hoenn -> Treeko - Jirachi)
    else if (pokemonRegions.includes(searchValue.toLowerCase())) {
      resultingFilteredPokemon = pokemonToFilter.filter(
        (pokemon) => pokemon.region_name == searchValue.toLowerCase()
      );
    }
    // Search by catagory (ex: Mythicals -> Mew - Pecharunt)
    else if (pokemonCatagories.includes(searchValue.toLowerCase())) {
      resultingFilteredPokemon = pokemonToFilter.filter((pokemon) =>
        pokemon.keywords.includes(searchValue.toLowerCase())
      );
    }
    // Searching by name (ex: Charm -> Charmander, Charmeleon)
    else {
      const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
      resultingFilteredPokemon = pokemonToFilter.filter(
        (pokemon) => pokemon.name_EN.toLowerCase().match(searchRegex) != null
      );
    }

    // Inverse the search results
    if (isNegatedSearch) {
      resultingFilteredPokemon = filterNot(
        pokemonToFilter,
        resultingFilteredPokemon
      );
    }

    return resultingFilteredPokemon;
  }

  // Don't show Pokemon that aren't in GO yet (Spoilers)
  // let remainingPokemon = pokemonData.filter(
  //   (pokemon) => !missingPokemon.includes(pokemon.id)
  // );

  let remainingPokemon = pokemonData;

  // Handles NOT, AND, OR, and RANGE
  let resultingPokemon = [];
  // OR denotes a seperate search entirely
  const commaSearchTerms = searchValue.split(/[,:;]/);
  for (const commaTerm of commaSearchTerms) {
    // AND denotes a search that keeps filtering down
    const andSearchTerms = commaTerm.split(/[&|]/);
    let resultingSearchPokemon = remainingPokemon;
    for (const andTerm of andSearchTerms) {
      const searchTerm = andTerm.trim();
      const isNegatedSearch = searchTerm.includes('!');
      resultingSearchPokemon = filterThroughPokemon(
        resultingSearchPokemon,
        searchTerm.replace('!', ''), // Trim the !. It's captured in the boolean
        isNegatedSearch
      );
    }
    resultingPokemon = resultingPokemon.concat(resultingSearchPokemon);
  }

  // Remove duplicates found in OR searches
  resultingPokemon = [...new Set(resultingPokemon)];

  // Filters are AND searches after all the other filtering is done (tested in POGO)
  if (filterTags.length > 0) {
    for (const filter of filterTags) {
      resultingPokemon = filterThroughPokemon(resultingPokemon, filter, false);
    }
  }

  // Sort the entire list based on the user selection
  const sortingFunctions = {
    0: (a, b) => a.id - b.id, // Numberical lowest -> highest
    1: (a, b) => b.id - a.id, // Numerical highest -> lowest
    2: (a, b) => a.name_EN.localeCompare(b.name_EN), // Alphabetical
    3: (a, b) => b.name_EN.localeCompare(a.name_EN), // Reverse alphabetical
  };
  resultingPokemon.sort(sortingFunctions[sortingOrder]);

  return resultingPokemon;
}

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

function PokemonGrid({
  languageCode,
  sortingOrder,
  setPopupText,
  setPopupKey,
  searchValue,
  filterTags,
  setTutorialModalOpen,
  setSortModalOpen,
  blockHomeScroll,
}) {
  const pokemonList = searchFilterAndSortPokemon(
    searchValue,
    filterTags,
    sortingOrder
  ).map((pokemon) => {
    const nameForeign = pokemon[`name_${languageCode}`];
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
  });

  return (
    <div className="pokemon-grid-container">
      <HomeScreenFloatingButtons
        sortingOrder={sortingOrder}
        setPopupText={setPopupText}
        setTutorialModalOpen={setTutorialModalOpen}
        setSortModalOpen={setSortModalOpen}
        blockHomeScroll={blockHomeScroll}
      />
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

function SearchBackButton({
  setSearchBackButtonVisibility,
  setIsDoubleDeckerLayout,
  setFilterModalOpen,
  allowHomeScroll,
  setSearchValue,
  setFilterTags,
}) {
  // Literally clear out everything.
  function handleSearchBackButtonClick() {
    setSearchBackButtonVisibility(false);
    setIsDoubleDeckerLayout(false);
    setFilterModalOpen(false);
    allowHomeScroll();
    setSearchValue('');
    setFilterTags([]);
  }
  return (
    <div
      onClick={handleSearchBackButtonClick}
      className="searchbar-back-btn"
      title="Clear & Exit"
    >
      <Image src={searchBack} width={12} height={22} alt="" quality={100} />
    </div>
  );
}

function FilterBarBubble({
  filterTag,
  filterTags,
  setFilterTags,
  setIsDoubleDeckerLayout,
  setFilterModalOpen,
  blockHomeScroll,
  allowHomeScroll,
  searchInputRef,
  searchValue,
}) {
  function clearFilterTag(event) {
    // Prevent click event from reaching the underlying bubble
    event.stopPropagation();

    const newFilterTags = filterTags.filter((tag) => tag !== filterTag);

    if (newFilterTags.length == 0) {
      setIsDoubleDeckerLayout(false);
      if (searchValue.length > 0) {
        // There's still text so show the results
        setFilterModalOpen(false);
        allowHomeScroll();
      } else {
        // There's no text and no more tags
        setFilterModalOpen(true);
        blockHomeScroll();
      }
    }
    setFilterTags(newFilterTags);
  }

  function handleFilterTagClick(event) {
    // Prevent click event from reaching the underlying scroll bar
    // event.stopPropagation();
    setFilterModalOpen(true);
    blockHomeScroll();
    setIsDoubleDeckerLayout(true);
    searchInputRef.current.focus();
  }

  return (
    <div className="filter-tag-bubble-container">
      <div
        className="filter-tag-bubble"
        title={`Filtering by ${filterTag}`}
        onClick={handleFilterTagClick}
      >
        <span className="filter-tag-bubble-span">{filterTag}</span>
        <div
          onClick={clearFilterTag}
          className="filter-tag-bubble-x"
          title="Clear Filter"
        >
          <Image src={filterX} width={9} height={9} alt="" quality={100} />
        </div>
      </div>
    </div>
  );
}

function ScrollingFilterBar({
  setFilterModalOpen,
  blockHomeScroll,
  allowHomeScroll,
  isDoubleDeckerLayout,
  setIsDoubleDeckerLayout,
  filterTags,
  setFilterTags,
  searchInputRef,
  searchValue,
}) {
  function handleScrollingFilterBarClick() {
    setFilterModalOpen(true);
    blockHomeScroll();
    // If there's no filter bubbles up there's no scroll bar
    setIsDoubleDeckerLayout(true); // Should always be true.
    searchInputRef.current.focus();
  }

  return (
    <div
      className={
        isDoubleDeckerLayout
          ? 'scrolling-filter-bar scrolling-filter-bar-dd'
          : 'scrolling-filter-bar'
      }
      onClick={handleScrollingFilterBarClick}
      title="Search or filter through Pokémon"
    >
      {filterTags.map((filterTag) => (
        <FilterBarBubble
          key={filterTag}
          filterTag={filterTag}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          setFilterModalOpen={setFilterModalOpen}
          blockHomeScroll={blockHomeScroll}
          allowHomeScroll={allowHomeScroll}
          searchInputRef={searchInputRef}
          searchValue={searchValue}
        />
      ))}
    </div>
  );
}

function ClearTextButton({
  setFilterTags,
  isDoubleDeckerLayout,
  setIsDoubleDeckerLayout,
  setSearchValue,
  setFilterModalOpen,
  blockHomeScroll,
}) {
  function handleClearTextButtonClick() {
    setFilterTags([]);
    setIsDoubleDeckerLayout(false);
    setSearchValue('');
    setFilterModalOpen(true);
    blockHomeScroll();
  }
  return (
    <div
      onClick={handleClearTextButtonClick}
      className={
        isDoubleDeckerLayout
          ? 'searchbar-clear-search-btn searchbar-clear-search-btn-dd'
          : 'searchbar-clear-search-btn'
      }
      title="Clear Search"
    >
      {isDoubleDeckerLayout ? (
        <Image src={clearXLong} width={32} height={64} alt="" quality={100} />
      ) : (
        <Image src={clearX} width={32} height={40} alt="" quality={100} />
      )}
    </div>
  );
}

function SearchBar({
  popupText,
  popupKey,
  searchValue,
  setSearchValue,
  screenWasChanged,
  filterTags,
  setFilterTags,
  searchBackButtonVisibility,
  setSearchBackButtonVisibility,
  isDoubleDeckerLayout,
  setIsDoubleDeckerLayout,
  allowHomeScroll,
  blockHomeScroll,
  setFilterModalOpen,
  searchInputRef,
}) {
  const [wasFocused, setWasFocused] = useState(false);

  const handleInputChange = (e) => {
    // User typing anything will close filter screen
    if (e.target.value.length > 0) {
      setFilterModalOpen(false);
      allowHomeScroll();
    } else {
      setFilterModalOpen(true);
      blockHomeScroll();
    }
    setSearchValue(e.target.value);
  };

  function handleSearchBarClick() {
    setSearchBackButtonVisibility(true);
    if (filterTags.length > 0) {
      setIsDoubleDeckerLayout(true);
    }
    setFilterModalOpen(true);
    blockHomeScroll();
  }

  function handleSearchBarFocus() {
    // User has chosen at least one filter tag
    setWasFocused(true);
    searchInputRef.current.focus();
    setFilterModalOpen(true);
    blockHomeScroll();
  }

  // Default in the middle
  let backgroundAnimationClassName = '';
  // Background stays left even after a screen change
  if (screenWasChanged && wasFocused) {
    backgroundAnimationClassName = 'search-input-background-left';
  }
  // Once the search bar is clicked once, play the animation
  else if (wasFocused) {
    backgroundAnimationClassName = 'search-input-background-animation';
  }

  let backgroundImageClassName = 'si-bg si-bg-magnifying';
  if (filterTags.length > 0 && !isDoubleDeckerLayout) {
    backgroundImageClassName = 'si-bg si-bg-filter';
  } else if (isDoubleDeckerLayout) {
    backgroundImageClassName = 'si-bg-dd search-input-background-left-dd';
  }

  let searchInputClassName = isDoubleDeckerLayout
    ? 'search-input search-input-dd'
    : 'search-input';

  return (
    <div className="searchbar-container">
      <div
        className={`searchbar-grid ${
          isDoubleDeckerLayout ? 'searchbar-grid-dd' : ''
        }`}
      >
        <CopyPopup popupText={popupText} popupKey={popupKey} />

        {searchBackButtonVisibility && (
          <SearchBackButton
            setSearchBackButtonVisibility={setSearchBackButtonVisibility}
            setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
            setFilterModalOpen={setFilterModalOpen}
            allowHomeScroll={allowHomeScroll}
            setSearchValue={setSearchValue}
            setFilterTags={setFilterTags}
          />
        )}
        {(filterTags.length > 0 || searchValue.length > 0) && (
          <ClearTextButton
            setFilterTags={setFilterTags}
            isDoubleDeckerLayout={isDoubleDeckerLayout}
            setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
            setSearchValue={setSearchValue}
            setFilterModalOpen={setFilterModalOpen}
            blockHomeScroll={blockHomeScroll}
          />
        )}
        {isDoubleDeckerLayout && (
          <div className="search-input-dd-line" onClick={handleSearchBarFocus}>
            <Image
              src={doubleDeckerLine}
              width={200}
              height={1}
              alt=""
              quality={100}
            />
          </div>
        )}
        {filterTags.length > 0 && (
          <ScrollingFilterBar
            setFilterModalOpen={setFilterModalOpen}
            blockHomeScroll={blockHomeScroll}
            allowHomeScroll={allowHomeScroll}
            isDoubleDeckerLayout={isDoubleDeckerLayout}
            setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            searchInputRef={searchInputRef}
            searchValue={searchValue}
          />
        )}

        <div
          className={`searchbar ${
            searchBackButtonVisibility ? 'single-back' : ''
          } `}
          title="Search or filter through Pokémon"
        >
          <input
            className={`${searchInputClassName} ${backgroundImageClassName} ${backgroundAnimationClassName}`}
            type="text"
            placeholder={!searchBackButtonVisibility ? 'Search' : ''}
            value={searchValue}
            onChange={handleInputChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onFocus={handleSearchBarFocus}
            onClick={handleSearchBarClick}
            ref={searchInputRef}
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
  // Function to open the LanguageSelection Screen when the 🔽 button us clicked
  function openLanguageSelection() {
    // Clear so popup text doesn't happen after language selection
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
        onClick={openLanguageSelection}
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

function HomeScreenFloatingButtons({
  sortingOrder,
  setPopupText,
  setTutorialModalOpen,
  setSortModalOpen,
  blockHomeScroll,
}) {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

  const scrollThreshold = 500; // Adjust's when the ⬆️ button appears
  // Add a scroll event listener to track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down a certain amount
      const scrollY = window.scrollY;
      setIsScrollToTopVisible(scrollY > scrollThreshold);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll back to the top when the ⬆️ button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth scrolling effect
    });
  };

  // Function to open the Tutorial Sodal when the ❓ button us clicked
  function openTutorial() {
    setTutorialModalOpen(true);
    // Clear so popup text doesn't happen after language selection
    setPopupText(null);
    // Block home scrolling since we're going to the Tutorial Screen
    blockHomeScroll();
  }

  function openSortOptions() {
    setSortModalOpen(true);
    // Clear so popup text doesn't happen after language selection
    setPopupText(null);
    // Block home scrolling since we're going to the Tutorial Screen
    blockHomeScroll();
  }

  let currentSortButton = ascendingButton;
  switch (sortingOrder) {
    case 0:
      currentSortButton = ascendingButton;
      break;
    case 1:
      currentSortButton = descendingButton;
      break;
    case 2:
      currentSortButton = aZButton;
      break;
    case 3:
      currentSortButton = zAButton;
      break;
    default:
      currentSortButton = ascendingButton;
  }

  return (
    <>
      <div id="scroll-to-top-button">
        {isScrollToTopVisible && (
          <button
            onClick={scrollToTop}
            className={`circular-btn scroll-up-btn`}
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
      <div id="question-button">
        <button
          onClick={openTutorial}
          className={'circular-btn help-btn'}
          title="Tutorial"
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
      </div>
      <div id="current-sort-option-button">
        <button
          onClick={openSortOptions}
          className={'circular-btn sort-btn'}
          title="Sort"
        >
          <Image
            src={currentSortButton}
            height={70}
            width={70}
            alt=""
            quality={100}
            unoptimized={true}
          />
        </button>
      </div>
    </>
  );
}

// Filter Screen

function FilterOptionButton({
  filterTags,
  setFilterTags,
  filterButtonText,
  setIsDoubleDeckerLayout,
  searchValue,
  imagePath,
  allowHomeScroll,
  setFilterModalOpen,
}) {
  function handleFilterOptionButtonClick() {
    setFilterModalOpen(false);
    allowHomeScroll();
    // Add only unique tags
    if (!filterTags.includes(filterButtonText)) {
      setFilterTags([...filterTags, filterButtonText]);
    }
    if (searchValue.length > 0) {
      setIsDoubleDeckerLayout(true);
    } else {
      setIsDoubleDeckerLayout(false);
    }
  }

  return (
    <div className="filter-option-btn" onClick={handleFilterOptionButtonClick}>
      <Image
        src={imagePath}
        alt={filterButtonText}
        quality={100}
        unoptimized={true}
        height={65}
        width={65}
      />
      <br></br>
      {filterButtonText}
    </div>
  );
}

function FilterOptionsScreen({
  searchValue,
  filterTags,
  setFilterTags,
  setSearchBackButtonVisibility,
  setIsDoubleDeckerLayout,
  allowHomeScroll,
  filterModalOpen,
  setFilterModalOpen,
}) {
  function handleFilterXBtnClick() {
    setFilterModalOpen(false);
    allowHomeScroll();
    if (filterTags.length == 0 && !searchValue) {
      setSearchBackButtonVisibility(false);
    }
    if (!searchValue) {
      setIsDoubleDeckerLayout(false);
    }
  }

  function mapOutFilterButtons(filterMapping) {
    return filterMapping.map((entry) => {
      return (
        <FilterOptionButton
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={entry.text}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
          imagePath={entry.imagePath}
          key={entry.text}
          allowHomeScroll={allowHomeScroll}
          setFilterModalOpen={setFilterModalOpen}
        />
      );
    });
  }

  const specialFilterMappings = [
    { text: 'Starter', imagePath: starter },
    { text: 'Regional Rodent', imagePath: rodent },
    { text: 'Regional Bird', imagePath: bird },
    { text: 'Regional Bug', imagePath: caterpie },
    { text: 'Pikaclone', imagePath: pikaclone },
    { text: 'Fossil', imagePath: fossil },
    { text: 'Psuedo Legendary', imagePath: pseudo },
    { text: 'Legendary', imagePath: legendary },
    { text: 'Mythical', imagePath: mythical },
    { text: 'Baby', imagePath: baby },
    { text: 'Can Mega Evolve', imagePath: mega },
    { text: 'Ultra Beast', imagePath: ultraBeast },
    { text: 'Can Gigantamax', imagePath: gmax },
    { text: 'Paradox', imagePath: paradox },
    { text: 'Region Exclusive', imagePath: regional },
  ];

  const pokemonRegionMappings = [
    { text: 'Kanto', imagePath: kanto },
    { text: 'Johto', imagePath: johto },
    { text: 'Hoenn', imagePath: hoenn },
    { text: 'Sinnoh', imagePath: sinnoh },
    { text: 'Unova', imagePath: unova },
    { text: 'Kalos', imagePath: kalos },
    { text: 'Alola', imagePath: alola },
    { text: 'Galar', imagePath: galar },
    { text: 'Hisui', imagePath: hisui },
    { text: 'Paldea', imagePath: paldea },
    { text: 'Unknown', imagePath: unknown },
  ];

  const pokemonTypesFilterMappings = [
    { text: 'Normal', imagePath: normal },
    { text: 'Fighting', imagePath: fighting },
    { text: 'Flying', imagePath: flying },
    { text: 'Poison', imagePath: poison },
    { text: 'Ground', imagePath: ground },
    { text: 'Rock', imagePath: rock },
    { text: 'Bug', imagePath: bug },
    { text: 'Ghost', imagePath: ghost },
    { text: 'Steel', imagePath: steel },
    { text: 'Fire', imagePath: fire },
    { text: 'Water', imagePath: water },
    { text: 'Grass', imagePath: grass },
    { text: 'Electric', imagePath: electric },
    { text: 'Psychic', imagePath: psychic },
    { text: 'Ice', imagePath: ice },
    { text: 'Dragon', imagePath: dragon },
    { text: 'Dark', imagePath: dark },
    { text: 'Fairy', imagePath: fairy },
  ];

  const specialFilterOptionButtons = mapOutFilterButtons(specialFilterMappings);
  const regionFilterOptionButtons = mapOutFilterButtons(pokemonRegionMappings);
  const typeFilterOptionButtons = mapOutFilterButtons(
    pokemonTypesFilterMappings
  );

  function handleClose() {
    setFilterModalOpen(false);
  }

  return (
    <Modal
      isOpen={filterModalOpen}
      onRequestClose={handleClose}
      className="modal-content-filters"
      overlayClassName="modal-overlay-filters"
      shouldFocusAfterRender={false}
    >
      <div className="filter-screen-container">
        <div className="filter-screen-content">
          <h2>Special</h2>
          <div className="filter-screen-category-grid">
            {specialFilterOptionButtons}
          </div>
          <h2>Pokémon Region</h2>
          <div className="filter-screen-category-grid">
            {regionFilterOptionButtons}
          </div>
          <h2>Pokémon Type</h2>
          <div className="filter-screen-category-grid">
            {typeFilterOptionButtons}
          </div>
          <div id="scroll-to-top-button">
            <button
              onClick={handleFilterXBtnClick}
              className="circular-btn scroll-up-btn"
              title="Exit"
            >
              <Image
                src={xButton}
                height={50}
                width={50}
                alt=""
                quality={100}
                unoptimized={true}
              />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Main Screen

function HomeScreen({
  languageCode,
  sortingOrder,
  setLanguageModalOpen,
  setTutorialModalOpen,
  setSortModalOpen,
  blockHomeScroll,
  allowHomeScroll,
}) {
  // Change the text every time a NEW Pokemon is clicked on so the new text is displayed
  const [popupText, setPopupText] = useState(null);
  // Change the key every time a Pokemon is clicked on so the notif pops up again
  const [popupKey, setPopupKey] = useState(0);
  // Filtering what Pokemon are shown in the grid
  const [searchValue, setSearchValue] = useState('');
  // False = 🔎 icon is in the middle, True = 🔎 icon is on the left
  const [screenWasChanged, setScreenWasChanged] = useState(false);
  // Keeping track of what filter tags are in the search
  const [filterTags, setFilterTags] = useState([]);
  const [isDoubleDeckerLayout, setIsDoubleDeckerLayout] = useState(false);
  // Keeping track of < button next to Search Bar
  const [searchBackButtonVisibility, setSearchBackButtonVisibility] =
    useState(false);
  // Show filters whenever user clicks on the search bar (mimicks Pokemon GO)
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const searchInputRef = useRef(null);

  return (
    <div>
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
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        screenWasChanged={screenWasChanged} // TODO: Change the way the 🔎 icon works
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        searchBackButtonVisibility={searchBackButtonVisibility}
        setSearchBackButtonVisibility={setSearchBackButtonVisibility}
        isDoubleDeckerLayout={isDoubleDeckerLayout}
        setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
        setFilterModalOpen={setFilterModalOpen}
        blockHomeScroll={blockHomeScroll}
        allowHomeScroll={allowHomeScroll}
        searchInputRef={searchInputRef}
      />
      <FilterOptionsScreen
        searchValue={searchValue}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        setSearchBackButtonVisibility={setSearchBackButtonVisibility}
        setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
        filterModalOpen={filterModalOpen}
        setFilterModalOpen={setFilterModalOpen}
        allowHomeScroll={allowHomeScroll}
      />
      <PokemonGrid
        languageCode={languageCode}
        sortingOrder={sortingOrder}
        setPopupText={setPopupText}
        setPopupKey={setPopupKey}
        searchValue={searchValue}
        filterTags={filterTags}
        setTutorialModalOpen={setTutorialModalOpen}
        setSortModalOpen={setSortModalOpen}
        blockHomeScroll={blockHomeScroll}
      />
    </div>
  );
}

// Sort Buttons

function SortOptionButton({
  setSortingOrder,
  setTutorialModalOpen,
  allowHomeScroll,
  sortingOrderOption,
  buttonPic,
  buttonText,
  buttonTitle,
}) {
  function handleSortButtonClick() {
    setSortingOrder(sortingOrderOption);
    setTutorialModalOpen(false);
    allowHomeScroll();
  }
  return (
    <div
      className="sort-options-btn-container"
      onClick={handleSortButtonClick}
      title={buttonTitle}
    >
      <span className="sort-options-span">{buttonText}</span>
      <button className={'sort-options-circ-btn'}>
        <Image
          src={buttonPic}
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

// Sort Screen

function SortOptionScreen({
  sortingOrder,
  setSortingOrder,
  sortModalOpen,
  setSortModalOpen,
  allowHomeScroll,
}) {
  function handleClose() {
    setSortModalOpen(false);
  }

  const sortOptionButtonMap = [
    {
      sortingOrder: 0,
      imagePath: ascendingButton,
      text: 'NUMBER (ASC.)',
      title: 'Sort by number (ascending)',
    },
    {
      sortingOrder: 1,
      imagePath: descendingButton,
      text: 'NUMBER (DESC.)',
      title: 'Sort by number (descending)',
    },
    {
      sortingOrder: 2,
      imagePath: aZButton,
      text: 'NAME (A-Z)',
      title: 'Sort by name (A-Z)',
    },
    {
      sortingOrder: 3,
      imagePath: ascendingButton,
      text: 'NAME (Z-A)',
      title: 'Sort by name (Z-A)',
    },
    {
      sortingOrder: 1,
      imagePath: xButton,
      text: '',
      title: 'Home',
    },
  ];

  const sortOptionButtons = sortOptionButtonMap.map((option) => {
    return (
      <SortOptionButton
        setSortingOrder={setSortingOrder}
        setTutorialModalOpen={setSortModalOpen}
        allowHomeScroll={allowHomeScroll}
        sortingOrderOption={option.sortingOrder}
        buttonPic={option.imagePath}
        buttonText={option.text}
        buttonTitle={option.title}
        key={option.text}
      />
    );
  });

  return (
    <Modal
      isOpen={sortModalOpen}
      onRequestClose={handleClose}
      className="modal-content modal-content-100"
      overlayClassName="modal-overlay"
    >
      <div className="base-container">
        <div className="base-content sort-options-grid-container">
          <div className="sort-options-grid">{sortOptionButtons}</div>
        </div>
      </div>
    </Modal>
  );
}

// Tutorial

function TutorialBackButton({ setTutorialModalOpen, allowHomeScroll }) {
  function handleBackButtonClick() {
    setTutorialModalOpen(false);
    allowHomeScroll();
  }
  return (
    <div id="back-button">
      <button
        onClick={handleBackButtonClick}
        className="circular-btn back-btn"
        title="Home"
      >
        <Image
          src={backButtonRotated}
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
      <div className="base-container">
        <div className="base-content">
          <TutorialBackButton
            setTutorialModalOpen={setTutorialModalOpen}
            allowHomeScroll={allowHomeScroll}
          />
          <div className="tutorial">
            <u>TUTORIAL</u>
            <p>1. Find the Pokémon you want to nickname.</p>
            <div className="tutorial-s1-container">
              <div className="tutorial-s1-grid">
                <div>
                  <TutorialImage
                    imagePath={'/tutorial/tut1.webp'}
                    width={162}
                    height={265}
                  />
                  <p className="tipText">Search..</p>
                </div>
                <div>
                  <TutorialImage
                    imagePath={'/tutorial/tut2.webp'}
                    width={162}
                    height={265}
                    tipText={'or dex number!'}
                  />
                  <p className="tipText">or filter!</p>
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
              2. Tap on the Pokémon to automatically <br></br>put the foreign
              name into your clipboard.
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
            <p>
              TIP! If you want to know all the possible<br></br>ways to search
              or filter, please see <br></br>
              <Link href="/search-phrases" className="link">
                Search Phrases{' '}
              </Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
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
  function handleLanguageOptionButtonClick() {
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
      onClick={handleLanguageOptionButtonClick}
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
      <div className="base-container">
        <div className="base-content language-selection-grid">
          <div className="instructions language-selection-instructions">
            CHOOSE YOUR NICKNAMING LANGUAGE
          </div>
          {languageList}
        </div>
        <Footer />
      </div>
    </Modal>
  );
}

export default function App() {
  // User's selected nicknaming language. For displaying in the tooltip bar and what's in the Pokemon grid
  const [languageCode, setLanguageCode] = useState('JA');
  // 0: Numbers High -> Low, 1: Numbers Low -> High, 2: Name A-Z, 3: Name Z-A
  const [sortingOrder, setSortingOrder] = useState(0);
  // Keeping track of which non-home screen is open
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  // So scrolling on a popup screen doesn't effect the Home screen
  const [blockHomeScroll, allowHomeScroll] = useScrollBlock();

  return (
    <div>
      <Borders />
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
      <SortOptionScreen
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        sortModalOpen={sortModalOpen}
        setSortModalOpen={setSortModalOpen}
        allowHomeScroll={allowHomeScroll}
      />
      <HomeScreen
        languageCode={languageCode}
        sortingOrder={sortingOrder}
        setLanguageModalOpen={setLanguageModalOpen}
        setTutorialModalOpen={setTutorialModalOpen}
        setSortModalOpen={setSortModalOpen}
        blockHomeScroll={blockHomeScroll}
        allowHomeScroll={allowHomeScroll}
      />
    </div>
  );
}
