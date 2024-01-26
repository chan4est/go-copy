'use client';

import { pokemondata } from './lib/data.js';
import copy from 'copy-to-clipboard';
import Image from 'next/image'
import leftBorder from '../public/left-border.jpg'
import rightBorder from '../public/right-border.jpg'
import { useEffect, useState } from 'react';

// https://stackoverflow.com/a/175787/5221437
function isNumber(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function Pokemon({ EN_name, JP_name, pokemon_number, setPopupName, setClickTime }) {
   
    function handleClick() {
        copy(JP_name);
        setPopupName(JP_name)
        setClickTime(Date.now());
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

function PokemonTable({ setPopupName, searchValue, clickTime, setClickTime }) {
    let filteredPokemon = pokemondata;
    // Can search by dex number, or by name
    if (searchValue) {
        if (isNumber(searchValue)) {
            filteredPokemon = pokemondata.filter((pokemon) => pokemon.id == Number(searchValue));
        } else {
            const searchRegex = new RegExp(`^${searchValue.toLowerCase()}.*`);
            filteredPokemon = pokemondata.filter((pokemon) => pokemon.EN_name.toLowerCase().match(searchRegex) != null);
        }
    }
    filteredPokemon = filteredPokemon.map(pokemon => {
        return (
            <Pokemon
                key={pokemon.id}
                EN_name={pokemon.EN_name}
                JP_name={pokemon.JP_name}
                sprite_image={pokemon.sprite_image}
                pokemon_number={pokemon.id}
                setPopupName={setPopupName}
                clickTime={clickTime}
                setClickTime={setClickTime}
            />
        )}
    )
    return (
        <div className="pokemon-grid">
           {filteredPokemon}
        </div>
    )
}

function CopyPopup({ clickTime, popupName }) {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (clickTime) {
            setShowPopup(false);
            setTimeout(() => {
                setShowPopup(true);
            }, 10)
        }
    }, [clickTime]);
    return (
        <div className={showPopup ? "copy-popup copy-popup-fade-out" : "copy-popup"}>
            {popupName} COPIED
        </div>
    )
}

function SearchBar({ setSearchValue }) {
    return (
        <div className="searchbox">
            <form onSubmit={e => { e.preventDefault(); }}>
                <input type="text" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)}/>
            </form>
        </div>
    )
}

function TopBar({ clickTime, popupName, setSearchValue }) {
    return (
        <div className='topbar'>
            TAP TO COPY POKÉMON'S JAPANESE
            <br></br>
            NAME ONTO YOUR CLIPBOARD
            <CopyPopup clickTime={clickTime} popupName={popupName}/>
            <SearchBar setSearchValue={setSearchValue}/>
        </div>
    )
}

function LeftBorder() {
    return<Image 
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
    const [popupName, setPopupName] = useState('')
    const [searchValue, setSearchValue] = useState(null);
    const [clickTime, setClickTime] = useState();

    return (
        <>
            <LeftBorder/>
            <RightBorder/>
            <TopBar clickTime={clickTime} popupName={popupName} setSearchValue={setSearchValue}/>
            <PokemonTable setPopupName={setPopupName} searchValue={searchValue} clickTime={clickTime} setClickTime={setClickTime}/>
        </>
    )
}
