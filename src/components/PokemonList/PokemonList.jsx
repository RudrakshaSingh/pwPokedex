import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon";

    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL); //this downloads list of 20 pokemons
        const pokemonResults = response.data.results; //we get the array of pokemons

        //iterating over the array of pokemons and using their url to create an array of promises that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //passing that promise array to axios.all to get array of 20 pokemons with detailed data
        const pokemonData = await axios.all(pokemonResultPromise); //axios.all allow us to pass an array of promises when all data is downloaded
        console.log(pokemonData);

        //now iterate on the data of each pokemon and exrtrating id,name image,types
        const res = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types,
            };
        });
        console.log("hi", res);

        setPokemonList(res);
        console.log("hi", pokemonList);
        setIsLoading(false);
    }
    useEffect(() => {
        downloadPokemons();
    }, []); //callback the content will execute when element first get rendered.if dependancy array is not given if will execute callback everytime component renders.if pass dependency array if will execute only first time
    //we can give [x] to execute after changes in x only.to track particular variables

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">{isLoading ? "Loading..." : pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)}</div>
            <div className="controls">
                <button>Prev</button>
                <button>Next</button>
            </div>
        </div>
    );
}
export default PokemonList;
