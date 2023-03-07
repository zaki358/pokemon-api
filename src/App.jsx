import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card";
import { Navbar } from "./components/Navbar";
import { getAllPokemon, getPokemon } from "./utils/pokemon";

function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);

  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      await loadPokemon(res.results);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  return (
    <>
    <Navbar />
      <div className="App">
        {loading ? (
          <p>ローディング中だよ</p>
        ) : (
          <>
            <div className="pokemoCardContainer">
              {pokemonData.map((pokemon, i) => (
                <Card key={i} pokemon={pokemon} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
