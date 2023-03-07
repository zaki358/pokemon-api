import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card";
import { Navbar } from "./components/Navbar";
import { getAllPokemon, getPokemon } from "./utils/pokemon";

function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモン
      let res = await getAllPokemon(initialURL);
      //詳細なデータ
      await loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
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

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };
  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
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
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
