'use client';

import { pokemondata } from './lib/data.js';
import copy from 'copy-to-clipboard';
import Image from 'next/image'
import leftBorder from '../public/left-border.jpg'
import rightBorder from '../public/right-border.jpg'

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

function ScrollBar() {
    return (
        <div>
        </div>
    )
}

function copyAndPopup(JP_name) {
    copy(JP_name)
    alert(`${JP_name} COPIED`)
}

function Pokemon({EN_name, JP_name, sprite_image}) {
    return (
        <div className="pokemon-grid-item" onClick={() => copyAndPopup(JP_name)}>
            <img
                src={sprite_image}
                alt={"Image of the Pokemon " + EN_name}
            />
            <br></br>
            <div className="pokemon-en-text">
                {EN_name}
            </div>
            {JP_name}
        </div>
    )
}

function PokemonTable() {
    const list = pokemondata.map(pokemon => {
        return (
            <Pokemon
                key={pokemon.id}
                EN_name={pokemon.EN_name}
                JP_name={pokemon.JP_name}
                sprite_image={pokemon.sprite_image}
            />
        )}
    )
    return (
        <div className="pokemon-grid">
           {list}
        </div>
    )
}

function TopBar() {
    return (
        <div className='topbar'>
            TAP TO COPY POKÉMON'S JAPANESE
            <br></br>
            NAME ONTO YOUR CLIPBOARD
            <SearchBar/>
        </div>
    )
}

function SearchBar() {
    return (
        <div className="searchbox">
            <form >
                <input type="text" placeholder="Search" />
            </form>
        </div>
    )
}

export default function FilterablePokedex() {
    return (
        <>
            <LeftBorder />
            <RightBorder />
            <TopBar />
            <div className="filterable-dex">
                <PokemonTable/>
            </div>
        </>
    )
}
