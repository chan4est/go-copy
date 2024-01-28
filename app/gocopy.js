'use client';

import { pokemondata } from './lib/data.js';
import copy from 'copy-to-clipboard';
import Image from 'next/image'
import leftBorder from '../public/left-border.jpg'
import rightBorder from '../public/right-border.jpg'
import { useRef, useState } from 'react';

function Pokemon({ EN_name, JP_name, pokemon_number, setPopupText, setPopupKey }) {

    function handleClick() {
        copy(JP_name);
        setPopupText(JP_name)
        setPopupKey((prevID) => prevID + 1);
    };

    return (
        <button className="pokemon-grid-item"
            onClick={() => handleClick()}>
            <Image
                src={`/pokemon-images/${pokemon_number}.webp`}
                alt={"Image of the Pokemon " + EN_name}
                height={256}
                width={256}
                quality={100}
            />
            <br></br>
            <div className="pokemon-en-text">
                {EN_name}
            </div>
            <div className="pokemon-jp-text">
                {JP_name}
            </div>
        </button>
    )
}

function PokemonTable({ setPopupText, searchValue, setPopupKey }) {

    // https://stackoverflow.com/a/175787/5221437
    function isNumber(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    let filteredPokemon = pokemondata;
    // Can search by name or dex number
    if (searchValue) {
        if (isNumber(searchValue)) {
            filteredPokemon = pokemondata.filter((pokemon) => pokemon.id == Number(searchValue));
        } else {
            const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
            filteredPokemon = pokemondata.filter((pokemon) => pokemon.EN_name.toLowerCase().match(searchRegex) != null);
        }
    }
    const pokemonList = filteredPokemon.map(pokemon => {
        return (
            <Pokemon
                key={pokemon.id}
                EN_name={pokemon.EN_name}
                JP_name={pokemon.JP_name}
                sprite_image={pokemon.sprite_image}
                pokemon_number={pokemon.id}
                setPopupText={setPopupText}
                setPopupKey={setPopupKey}
            />
        )
    }
    )
    return (
        <div className="pokemon-grid">
            {pokemonList}
        </div>
    )
}

function CopyPopup({ popupText, popupKey }) {
    // https://stackoverflow.com/a/63194757/5221437
    // Re-renders every time a Pokemon is clicked
    return (
        <div key={popupKey} className={popupText ? 'copy-popup popup-animation' : 'copy-popup'}>
            {popupText}
        </div>
    )
}

function SearchBar({ popupText, popupKey, searchValue, setSearchValue }) {

    const [isFocused, setisFocused] = useState(false);
    const inputRef = useRef(null);

    // On focus - move left side of bar inwards to make way for the button
    //            back arrow button should be visible
    //            move the magnifying glass icon to the edge
    // Once text is in in the bar, add the X button and | line
    // If the X button is clicked, text is cleared from searchValue and the bar itself 
    // If text is in the bar you cannot lose focus
    // Back arrow means  text is cleared from searchValue and the bar itself and bar FINALLY loses focus
    // ONLY WAY TO L FOCUS IS THE BACK ARROW

    function handleTextClear() {
       setSearchValue(null); 
       inputRef.current.value=''
    }

    function handleGoBack() {
        handleTextClear();
        setisFocused(false);
        inputRef.current.blur();
        // inputRef.current = null;
    }

    function handledFocused() {
        setisFocused(true);
    }

    function handleBlur() {
        setisFocused(false);
    }

    return (
        <div className='searchbar-container'>
            <CopyPopup popupText={popupText} popupKey={popupKey} />
            <div className="searchbar">
                {/* <button className='go-back-button' onClick={handleGoBack} style={{visibility: isFocused || searchValue ? 'visible': 'hidden'}} ></button> */}
                <input ref={inputRef} className='search-input' type="text" placeholder="Search" onFocus={handledFocused} onBlur={handleBlur} onChange={(e) => setSearchValue(e.target.value) } />
                {/* <button className='clear-text-button' style={{visibility: searchValue ? 'visible': 'hidden'}} onClick={handleTextClear}> X </button> */}
            </div>
        </div>
    )
}

function TopBarContainer({ popupText, popupKey, searchValue, setSearchValue }) {
    return (
        <div className='topbar-container'>
            TAP TO COPY POKÉMON'S <button className='lang-selector'>JAPANESE</button>
            {/* TAP TO COPY POKÉMON'S JAPANESE */}
            <br></br>
            NAME ONTO YOUR CLIPBOARD
            <SearchBar popupText={popupText} popupKey={popupKey} searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
    )
}

function LeftBorder() {
    return <Image
        src={leftBorder}
        className={"left-background"}
        alt=""
    />
}

function RightBorder() {
    return <Image
        src={rightBorder}
        className={"right-background"}
        alt=""
    />
}

export default function FilterablePokedex() {
    const [popupText, setPopupText] = useState(null)
    const [popupKey, setPopupKey] = useState(0);
    const [searchValue, setSearchValue] = useState(null);

    return (
        <>
            <LeftBorder />
            <RightBorder />
            <TopBarContainer popupText={popupText} popupKey={popupKey} searchValue={searchValue} setSearchValue={setSearchValue} />
            <PokemonTable setPopupText={setPopupText} setPopupKey={setPopupKey} searchValue={searchValue} />
        </>
    )
}
