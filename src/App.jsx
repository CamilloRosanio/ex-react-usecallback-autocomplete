import { useState, useEffect } from "react"

// `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`

function App() {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  console.log(suggestions);

  // Salvo questa funzione in una variabile perchè mi viene più comodo in seguito passarla come parametro al DEBOUNCE.
  const fetchProducts = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`);
      const data = res.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    /*Inizialmente la funzione era scritta per esteso all'interno dello USE-EFFECT, che non accetta funzioni ASYNC al suo interno.
    Il FETCH veniva infatti eseguito tramite una IIFE (funzione asincrona immediatamente invocata).
    Una volta che però abbiamo salvato la logica della funzione in una variabile (sopra), abbiamo potuto rimuovere la IIFE (che infatti sopra non è presente).*/
    fetchProducts(query);

  }, [query]);

  return (
    <>
      <h1>Autocomplete</h1>
      <input
        type="text"
        placeholder="Cerca un prodotto..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="debug">
          {suggestions.map(product =>
            <p key={product.id} className="debug">{product.name}</p>
          )}
        </div>
      )}
    </>
  )
}

export default App
