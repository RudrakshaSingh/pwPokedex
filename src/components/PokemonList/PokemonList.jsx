import { useEffect, useState } from "react";
//queueinga series of set updates=note set state update cannot be used multiple times ata time it will take last one only in that case
//It is an uncommon use case, but if you would like to update the same state variable multiple times before the next render, instead of passing the next state value like setNumber(number + 1), you can pass a function that calculates the next state based on the previous one in the queue, like setNumber(n => n + 1).
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
    // const [pokemonList, setPokemonList] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    // const [pokedexUrl, setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");

    // const [nextUrl, setNextUrl] = useState("");

    // const [prevUrl, setPrevUrl] = useState("");

    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: "https://pokeapi.co/api/v2/pokemon",
        nextUrl: "",
        prevUrl: "",
    });

    async function downloadPokemons() {
        // setIsLoading(true);
        setPokemonListState((state) => ({ ...state, isLoading: true }));
        const response = await axios.get(pokemonListState.pokedexUrl); //this downloads list of 20 pokemons

        const pokemonResults = response.data.results; //we get the array of pokemons

        console.log("respnose is", response.data, "jjjjj", response.data.next);
        console.log("kj", pokemonListState);
        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next,
            prevUrl: response.data.previous,
        }));

        //iterating over the array of pokemons and using their url to create an array of promises
        // that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //passing that promise array to axios.all to get array of 20 pokemons with detailed data
        const pokemonData = await axios.all(pokemonResultPromise); //axios.all allow us to pass an array of promises when all data is downloaded

        console.log(pokemonData);

        //now iterate on the data of each pokemon and exrtrating id,name image,types
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types,
            };
        });
        console.log("hi", pokeListResult);
        setPokemonListState((state) => ({
            ...state,
            pokemonList: pokeListResult,
            isLoading: false,
        }));
    }
    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]); //callback the content will execute when element first get rendered.if dependancy array is not given if will execute callback everytime component renders.if pass dependency array if will execute only first time
    //we can give [x] to execute after changes in x only.to track particular variables

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">{pokemonListState.isLoading ? "Loading..." : pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)}</div>
            <div className="controls">
                <button
                    disabled={pokemonListState.prevUrl == null}
                    onClick={() => {
                        const urlToSet = pokemonListState.prevUrl;
                        setPokemonListState((state) => ({
                            ...state,
                            pokedexUrl: urlToSet,
                        }));
                    }}
                >
                    Prev
                </button>
                <button
                    disabled={pokemonListState.nextUrl == null}
                    onClick={() => {
                        console.log(pokemonListState);
                        const urlToSet = pokemonListState.nextUrl;

                        setPokemonListState((state) => ({
                            ...state,
                            pokedexUrl: urlToSet,
                        }));
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
export default PokemonList;
