import { pokemondata } from './data.js';

function SearchBar() {
    return (
        <div>
            <img
                src={'../assets/serch.png'}
            />
            <h2>Search</h2>
        </div>
    )
}

function Pokemon({EN_name, JP_name, sprite_image}) {
    return (
        <div>
            <img
                src={sprite_image}
                alt={"Image of the Pokemon " + EN_name}
            />
            <br></br>
            {EN_name}
            <br></br>
            {JP_name}
        </div>
    )
}

function PokemonRows() {
    return (
        pokemondata.map(pokemon =>
            <Pokemon
                key={pokemon.id}
                EN_name={pokemon.EN_name}
                JP_name={pokemon.JP_name}
                sprite_image={pokemon.sprite_image}
            />
        )
    )
}

export default function GoCopy() {
    return (
        <div>
            <h1>TAP TO COPY POKEMON'S JAPANESE</h1>
            <br></br>
            <h1>NAME ONTO YOUR CLIPBOARD</h1>
            <SearchBar/>
            <PokemonRows/>
        </div>
    )
}
