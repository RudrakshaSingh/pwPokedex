import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [pokedexUrl, setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    const [nextUrl, setNextUrl] = useState("");
    const [prevUrl, setPrevUrl] = useState("");

    async function downloadPokemons() {
        setIsLoading(true);

        const response = await axios.get(pokedexUrl); //this downloads list of 20 pokemons
        const pokemonResults = response.data.results; //we get the array of pokemons
        console.log(pokemonResults);

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
        console.log(res);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);

        setPokemonList(res);
        setIsLoading(false);
    }
    useEffect(() => {
        downloadPokemons();
    }, [pokedexUrl]); //callback the content will execute when element first get rendered.if dependancy array is not given if will execute callback everytime component renders.if pass dependency array if will execute only first time
    //we can give [x] to execute after changes in x only.to track particular variables

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">{isLoading ? "Loading..." : pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)}</div>
            <div className="controls">
                <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)}>
                    Prev
                </button>
                <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)}>
                    Next
                </button>
            </div>
        </div>
    );
}
export default PokemonList;
