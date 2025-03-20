import { useState, useEffect, useCallback } from "react"

// `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`

// FUNZIONE DI DEBOUNCE GENERICA
/*Il DEBOUNCE accetta come parametri la funzione da "sospendere" per un tot di tempo specificato nel delay passato come argomento.
Questa funzione, avendo una CLOSURE, non deve essere ridichiarata ogni volta (ad ogni digitazione della query), ed andrà
quindi utilizzata insieme a USE-CALLBACK, lo strumento fornito direttamente da REACT, che fa in sintesi ciò che fanno
USE-MEMO e MEMO di REACT (cioè non ricaricare nuovamente gli stessi dati/componenti se non è necessario), ma per le funzioni.*/
const debounce = (callback, delay) => {
  let timeout;

  // Il DEBOUNCE è di fatto un HOF (high order function) che restituisce la versione con DEBOUNCE applicato della funzione passata come argomento (callback).
  return (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(value);
    }, delay)
  }
}

// NOTA: ci sono librerie (come LODASH ad esempio) che ci forniscono funzioni di DEBOUNCE già pronte. Basterebbe per esempio eseguire "npm install lodash" per potervi accedere.

function App() {

  // All'aggiornarsi di QUERY, il componente viene renderizzato nuovamente, ma noi, per conservar ela CLOSURE (cioè il delay del DEBOUCE in questo caso), dobbiamo impedire che la funzione venga ripetuta goni volta, appunto tramite DEBOUNCE utilizzato in combinazione con USE-CALLBACK di REACT.
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Salvo questa funzione in una variabile perchè mi viene più comodo in seguito passarla come parametro al DEBOUNCE.
  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`);
      const data = await res.json();
      setSuggestions(data);
      console.log('Richiesta API effettuata');
    } catch (error) {
      console.error(error);
    }
  }

  // Qui sfrutto USE-CALLBACK per non ricreare la funzione ogni volta a meno che le DEPENDENCIES non cambino, proprio come uno USE-EFFECT. Se l'array di DEPENDENCIES è vuoto, la funzione viene creata solo al primo mounting del COMPONENT.
  const debouncedFetchProducts = useCallback(
    // Evoco qui il DEOUNCE per ottenere la versione "debounceata" della Fetch.
    debounce(fetchProducts, 500)
    , [])

  useEffect(() => {

    /*Inizialmente la funzione era scritta per esteso all'interno dello USE-EFFECT, che non accetta funzioni ASYNC al suo interno.
    Il FETCH veniva infatti eseguito tramite una IIFE (funzione asincrona immediatamente invocata).
    Una volta che però abbiamo salvato la logica della funzione in una variabile (sopra), abbiamo potuto rimuovere la IIFE (che infatti sopra non è presente) per tornare alla normale sintassi ASYNC AWAIT.*/
    debouncedFetchProducts(query);

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
