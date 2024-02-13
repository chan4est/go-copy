'use client';

import { languageData } from './lib/languages';
import { missingPokemon } from './lib/missing-pokemon';
import { pokemonCatagories } from './lib/pokemon-categories';
import { pokemonRegions } from './lib/pokemon-regions';
import { pokemonTypes } from './lib/pokemon-types';
import { pokemonData } from './lib/pokemon';

import Borders from './components/Borders';
import Footer from './components/Footer';
import { useScrollBlock } from './components/useScrollBlock';

import backButton from '../public/btn-back.webp';
import backButtonRotated from '../public/btn-back-rot.webp';
import questionButton from '../public/btn-question.webp';
import ascendingButton from '../public/btn-number-down.webp';
import descendingButton from '../public/btn-number-up.webp';
import aZButton from '../public/btn-az.webp';
import zAButton from '../public/btn-za.webp';
import xButton from '../public/btn-x.webp';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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

function PokemonGrid({
  languageCode,
  sortingOrder,
  setPopupText,
  setPopupKey,
  searchValue,
  pokemonGridVisibility,
  filterTags,
  setTutorialModalOpen,
  setSortModalOpen,
  blockHomeScroll,
  footerRef,
}) {
  // https://stackoverflow.com/a/175787/5221437
  function isNumber(str) {
    if (typeof str != 'string') return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  function filterThroughPokemon(pokemonToFilter, searchValue) {
    searchValue = searchValue.trim();
    // Searching by dex number (ex: 150 -> Mewtwo)
    if (isNumber(searchValue)) {
      pokemonToFilter = pokemonToFilter.filter(
        (pokemon) => pokemon.id == Number(searchValue)
      );
    }
    // Searching by family (ex: +Pikachu -> Pichu, Pikachu, Raichu)
    else if (searchValue[0] == '+') {
      const searchRegex = new RegExp(
        `^${searchValue.substring(1).toLowerCase()}.*`
      );
      pokemonToFilter = pokemonToFilter.filter((pokemon) =>
        pokemon.family.some(
          (familyName) => familyName.match(searchRegex) != null
        )
      );
    }
    // Searching by type (ex: Dark -> Umbreon, Murkrow, etc..)
    else if (pokemonTypes.includes(searchValue.toLowerCase())) {
      pokemonToFilter = pokemonToFilter.filter((pokemon) =>
        pokemon.types.includes(searchValue.toLowerCase())
      );
    }
    // Searching by region (ex: Hoenn -> Treeko - Jirachi)
    else if (pokemonRegions.includes(searchValue.toLowerCase())) {
      pokemonToFilter = pokemonToFilter.filter(
        (pokemon) => pokemon.region_name == searchValue.toLowerCase()
      );
    }
    // Search by catagory (ex: Mythicals -> Mew - Pecharunt)
    else if (pokemonCatagories.includes(searchValue.toLowerCase())) {
      pokemonToFilter = pokemonToFilter.filter((pokemon) =>
        pokemon.keywords.includes(searchValue.toLowerCase())
      );
    }
    // Searching by name (ex: Charm -> Charmander, Charmeleon)
    else {
      const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
      pokemonToFilter = pokemonToFilter.filter(
        (pokemon) => pokemon.name_EN.toLowerCase().match(searchRegex) != null
      );
    }
    return pokemonToFilter;
  }

  // Remove the missing Pokemon
  // TODO: Make this happen before the app even starts
  let filteredPokemon = pokemonData.filter(
    (pokemon) =>
      // Don't show Pokemon that aren't in GO yet (Spoilers)
      !missingPokemon.includes(pokemon.id)
  );

  // Make sure the filter search string is accounted for
  let filterSearchStr = null;
  if (filterTags.length !== 0) {
    filterSearchStr = filterTags.join(' & ');
  }

  // Make a full search string including the user's input + filters
  let fullSearchStr = null;
  if (searchValue) {
    if (filterSearchStr) {
      fullSearchStr = filterSearchStr + ' & ' + searchValue;
    } else {
      fullSearchStr = searchValue;
    }
  } else if (filterSearchStr) {
    fullSearchStr = filterSearchStr;
  }

  if (fullSearchStr) {
    // AND search
    if (fullSearchStr.includes('&') || fullSearchStr.includes('|')) {
      // Split each search into different searches
      const differentSearches = fullSearchStr.split(/[&|]/);
      // Filter through the searches
      for (const i in differentSearches) {
        filteredPokemon = filterThroughPokemon(
          filteredPokemon,
          differentSearches[i]
        );
      }
    }
    // Regular search
    else {
      filteredPokemon = filterThroughPokemon(filteredPokemon, fullSearchStr);
    }
  }

  // Sort the entire list of Pokemon based on the user selection

  // Numerical highest -> lowest
  if (sortingOrder == 1) {
    filteredPokemon.sort(function (a, b) {
      return b.id - a.id;
    });
  }
  // Alphabetical
  else if (sortingOrder == 2) {
    filteredPokemon.sort(function (a, b) {
      var nameA = a.name_EN;
      var nameB = b.name_EN;

      if (nameA < nameB) {
        return -1; // nameA comes before nameB
      }
      if (nameA > nameB) {
        return 1; // nameA comes after nameB
      }
      return 0; // names must be equal
    });
  }
  // Reverse alphabetical
  else if (sortingOrder == 3) {
    filteredPokemon.sort(function (a, b) {
      var nameA = a.name_EN;
      var nameB = b.name_EN;

      if (nameA > nameB) {
        return -1; // nameA comes after nameB for reverse alphabetical order
      }
      if (nameA < nameB) {
        return 1; // nameA comes before nameB for reverse alphabetical order
      }
      return 0; // names must be equal
    });
  }

  const pokemonList = filteredPokemon.map((pokemon) => {
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
    <div
      className="pokemon-grid-container"
      // Make the grid invisible after the Search Bar has been clicked
      style={!pokemonGridVisibility ? { display: 'none' } : {}}
    >
      <HomeScreenFloatingButtons
        sortingOrder={sortingOrder}
        setPopupText={setPopupText}
        setTutorialModalOpen={setTutorialModalOpen}
        setSortModalOpen={setSortModalOpen}
        blockHomeScroll={blockHomeScroll}
        footerRef={footerRef}
        searchValue={searchValue}
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

function SearchBar({
  popupText,
  popupKey,
  setSearchValue,
  screenWasChanged,
  setPokemonGridVisibility,
  filterTags,
  setFilterTags,
  searchBackButtonVisibility,
  setSearchBackButtonVisibility,
  isDoubleDeckerLayout,
  setIsDoubleDeckerLayout,
}) {
  const [wasFocused, setWasFocused] = useState(false);
  const [hasTextClearButton, setHasTextClearButton] = useState(false);

  function SearchBackButton() {
    // Literally clear out everything.
    function handleSearchBackButtonClick() {
      setSearchBackButtonVisibility(false);
      setHasTextClearButton(false);
      setIsDoubleDeckerLayout(false);
      setPokemonGridVisibility(true);
      setSearchValue(null);
      setFilterTags([]);
    }
    return <button onClick={handleSearchBackButtonClick}>BACK TO MAIN</button>;
  }

  // TODO: Clear the text of the user's input in the DOM
  // TODO BUG: If user isn't focused on the search and clears text, it brings up the grid again and not the filter options
  function ClearTextButton() {
    function handleClearTextButtonClick() {
      setFilterTags([]);
      setSearchValue(null);
      setIsDoubleDeckerLayout(false);
    }
    return (
      <button onClick={handleClearTextButtonClick}>
        CLEAR FILTERS AND/OR TEXT
      </button>
    );
  }

  function FilterTagBubble({ filterTag }) {
    function clearFilterTag() {
      const newFilterTags = filterTags.filter((tag) => tag !== filterTag);
      console.log(newFilterTags);
      if (newFilterTags.length == 0) {
        setIsDoubleDeckerLayout(false);
      }
      setFilterTags(newFilterTags);
    }
    return <button onClick={clearFilterTag}>{filterTag}</button>;
  }

  function handleFocus() {
    // User has chosen at least one filter tag
    if (filterTags.length > 0) {
      setIsDoubleDeckerLayout(true);
    }
    setSearchBackButtonVisibility(true);
    setWasFocused(true);
    setPokemonGridVisibility(false);
  }

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
        <div className="searchbar" title="Search or filter through Pokémon">
          {searchBackButtonVisibility && <SearchBackButton />}
          {filterTags.length > 0 ? <h3>FilterIcon</h3> : ''}
          {filterTags.length > 0 || hasTextClearButton ? (
            <ClearTextButton />
          ) : (
            ''
          )}
          {filterTags.length > 0 ? (
            <h3>
              {filterTags.map((filterTag) => (
                <FilterTagBubble key={filterTag} filterTag={filterTag} />
              ))}
            </h3>
          ) : (
            ''
          )}
          {isDoubleDeckerLayout ? <h3>DOUBLE DECKER</h3> : ''}
          <input
            className={`search-input ${backgroundClassName}`}
            type="text"
            placeholder="Search"
            onChange={(e) => {
              // Put the X if there's search text
              if (e.target.value.length > 0) {
                setHasTextClearButton(true);
                setPokemonGridVisibility(true);
              }
              // Take away the X if there's no search or there's no filters
              else if (e.target.value.length == 0) {
                setHasTextClearButton(false);
              }
              setSearchValue(e.target.value);
            }}
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
  footerRef,
  searchValue,
}) {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  const scrollThreshold = 500; // Adjust's when the ⬆️ button appears
  const footerHeightFactor = 0.5; // Adjust's when the ⬆️ button moves and ❓ button disappears
  useEffect(() => {
    // Add a scroll event listener to track the scroll position
    const handleScroll = () => {
      // How far we've scrolled down
      const scrollY = window.scrollY;
      // How far we are from the footer
      const footerOffset =
        document.body.scrollHeight -
        window.innerHeight -
        footerHeight * footerHeightFactor;

      // True once we've scrolled down the page enough
      setIsScrollToTopVisible(scrollY > scrollThreshold);
      // True once the top of the footer + a little extra (footerHeightFactor) is visible
      setIsNearFooter(scrollY > footerOffset);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Add a resize event listener to track the footer's height
    function handleResize() {
      if (footerRef.current) {
        const height = footerRef.current.offsetHeight;
        setFooterHeight(height);
      }
    }

    handleResize(); // Call it initially to get the height
    // Attach the resize event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Clean up the event listeners when the components unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [footerRef, footerHeight]);

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
            className={`circular-btn scroll-up-btn ${
              isNearFooter
                ? 'scroll-up-btn-animation'
                : 'scroll-down-btn-animation'
            }`}
            title="Go back to the top"
            style={
              isNearFooter ? { bottom: `calc(3% + ${footerHeight}px)` } : {}
            }
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
        <style global jsx>{`
          .scroll-up-btn-animation {
            animation: move-up 0.15s;
            bottom: calc(3% + ${footerHeight}px);
          }

          @keyframes move-up {
            0% {
              bottom: 3%;
            }
            100% {
              bottom: calc(3% + ${footerHeight}px);
            }
          }

          .scroll-down-btn-animation {
            animation: move-down 0.15s;
            bottom: 3%;
          }

          @keyframes move-down {
            0% {
              bottom: calc(3% + ${footerHeight}px);
            }
            100% {
              bottom: 3%;
            }
          }
        `}</style>
      </div>
      <div id="question-button">
        {!isNearFooter && !searchValue && (
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
        )}
      </div>
      <div id="current-sort-option-button">
        {!isNearFooter && (
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
        )}
      </div>
    </>
  );
}

function FilterOptionButton({
  setPokemonGridVisibility,
  filterTags,
  setFilterTags,
  filterButtonText,
  setIsDoubleDeckerLayout,
  searchValue,
}) {
  function handleFilterOptionButtonClick() {
    setPokemonGridVisibility(true);
    // Add only unique tags
    if (!filterTags.includes(filterButtonText)) {
      console.log(filterTags);
      console.log(filterButtonText);
      setFilterTags([...filterTags, filterButtonText]);
    }
    if (!searchValue) {
      setIsDoubleDeckerLayout(false);
    }
  }

  return (
    <button onClick={handleFilterOptionButtonClick}>{filterButtonText}</button>
  );
}

function FilterOptionsScreen({
  searchValue,
  pokemonGridVisibility,
  setPokemonGridVisibility,
  filterTags,
  setFilterTags,
  setSearchBackButtonVisibility,
  setIsDoubleDeckerLayout,
}) {
  function handleFilterXBtnClick() {
    setPokemonGridVisibility(true);
    if (filterTags.length == 0 && !searchValue) {
      setSearchBackButtonVisibility(false);
    }
    if (!searchValue) {
      setIsDoubleDeckerLayout(false);
    }
  }

  return (
    <div style={pokemonGridVisibility ? { display: 'none' } : {}}>
      <h1>Special</h1>
      <div>
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Baby'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Legendary'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Mythical'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Ultra Beast'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Paradox'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
      </div>
      <h1>Region</h1>
      <div>
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Kanto'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Johto'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Hoenn'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Sinnoh'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Unova'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Kalos'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Alola'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Galar'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Hisui'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Paldea'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Unknown'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
      </div>
      <h1>Types</h1>
      <div>
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Normal'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Fighting'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Flying'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Poison'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Ground'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Rock'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Bug'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Ghost'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Steel'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Steel'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Fire'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Water'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Grass'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Electric'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Psychic'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Ice'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Dragon'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Dark'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
        <FilterOptionButton
          setPokemonGridVisibility={setPokemonGridVisibility}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterButtonText={'Fairy'}
          setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          searchValue={searchValue}
        />
      </div>
      <div>
        <h1>EXIT</h1>
        <button onClick={handleFilterXBtnClick}>EXIT FILTERS</button>
      </div>
    </div>
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
}) {
  // Change the text every time a NEW Pokemon is clicked on so the new text is displayed
  const [popupText, setPopupText] = useState(null);
  // Change the key every time a Pokemon is clicked on so the notif pops up again
  const [popupKey, setPopupKey] = useState(0);
  // Filtering what Pokemon are shown in the grid
  const [searchValue, setSearchValue] = useState(null);
  // False = 🔎 icon is in the middle, True = 🔎 icon is on the left
  const [screenWasChanged, setScreenWasChanged] = useState(false);
  // Keeping track of footer height so we can manipulate the floating buttons
  const footerRef = useRef(null);
  // Show grid by default, after search text input, or after choosing a filter
  const [pokemonGridVisibility, setPokemonGridVisibility] = useState(true);
  // Keeping track of what filter tags are in the search
  const [filterTags, setFilterTags] = useState([]);
  // TODO BUG: Shouldn't be double decker when it's only tags
  const [isDoubleDeckerLayout, setIsDoubleDeckerLayout] = useState(false);

  // Keeping track of < button next to Search Bar
  const [searchBackButtonVisibility, setSearchBackButtonVisibility] =
    useState(false);

  // SearchBarMode can be derived from other states
  // 0 -> No text, 1 -> Text only search, 2 -> Filters only search, 3 -> Hybrid w/ filters + text

  return (
    <div>
      <Borders />
      <div className="base-container">
        <div className="base-content">
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
            screenWasChanged={screenWasChanged} // TODO: Change the way the 🔎 icon works
            setPokemonGridVisibility={setPokemonGridVisibility}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            searchBackButtonVisibility={searchBackButtonVisibility}
            setSearchBackButtonVisibility={setSearchBackButtonVisibility}
            isDoubleDeckerLayout={isDoubleDeckerLayout}
            setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          />
          <FilterOptionsScreen
            searchValue={searchValue}
            pokemonGridVisibility={pokemonGridVisibility}
            setPokemonGridVisibility={setPokemonGridVisibility}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            setSearchBackButtonVisibility={setSearchBackButtonVisibility}
            setIsDoubleDeckerLayout={setIsDoubleDeckerLayout}
          />
          <PokemonGrid
            languageCode={languageCode}
            sortingOrder={sortingOrder}
            setPopupText={setPopupText}
            setPopupKey={setPopupKey}
            searchValue={searchValue}
            pokemonGridVisibility={pokemonGridVisibility}
            filterTags={filterTags}
            setTutorialModalOpen={setTutorialModalOpen}
            setSortModalOpen={setSortModalOpen}
            blockHomeScroll={blockHomeScroll}
            footerRef={footerRef}
          />
        </div>
        {/* <Footer footerRef={footerRef} /> */}
      </div>
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
      <button
        onClick={handleSortButtonClick}
        className={'sort-options-circ-btn'}
      >
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

  return (
    <Modal
      isOpen={sortModalOpen}
      onRequestClose={handleClose}
      className="modal-content modal-content-100"
      overlayClassName="modal-overlay"
    >
      <div className="base-container">
        <Borders />
        <div className="base-content sort-options-grid-container">
          <div className="sort-options-grid">
            <SortOptionButton
              setSortingOrder={setSortingOrder}
              setTutorialModalOpen={setSortModalOpen}
              allowHomeScroll={allowHomeScroll}
              sortingOrderOption={0}
              buttonPic={ascendingButton}
              buttonText={'NUMBER (ASC.)'}
              buttonTitle={'Sort by number (ascending)'}
            />
            <SortOptionButton
              setSortingOrder={setSortingOrder}
              setTutorialModalOpen={setSortModalOpen}
              allowHomeScroll={allowHomeScroll}
              sortingOrderOption={1}
              buttonPic={descendingButton}
              buttonText={'NUMBER (DESC.)'}
              buttonTitle={'Sort by number (descending)'}
            />
            <SortOptionButton
              setSortingOrder={setSortingOrder}
              setTutorialModalOpen={setSortModalOpen}
              allowHomeScroll={allowHomeScroll}
              sortingOrderOption={2}
              buttonPic={aZButton}
              buttonText={'NAME (A-Z)'}
              buttonTitle={'Sort by name (A-Z)'}
            />
            <SortOptionButton
              setSortingOrder={setSortingOrder}
              setTutorialModalOpen={setSortModalOpen}
              allowHomeScroll={allowHomeScroll}
              sortingOrderOption={3}
              buttonPic={zAButton}
              buttonText={'NAME (Z-A)'}
              buttonTitle={'Sort by name (Z-A)'}
            />
            <SortOptionButton
              setSortingOrder={setSortingOrder}
              setTutorialModalOpen={setSortModalOpen}
              allowHomeScroll={allowHomeScroll}
              sortingOrderOption={sortingOrder}
              buttonPic={xButton}
              buttonText={''}
              buttonTitle={'Home'}
            />
          </div>
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
          <Borders />
          <TutorialBackButton
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
        <Borders />
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
