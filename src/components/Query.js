import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Query = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const onSearch = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/query/",
        { query },
        { headers: { "Content-Type": "application/json" } }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error("Error querying database", error);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <input
        type="text"
        value={query}
        onChange={onQueryChange}
        placeholder="Enter your query here"
      />
      <button onClick={onSearch}>Search</button>
      <div>
        <h3>Results:</h3>
        <ul style={{ textAlign: "left" }}>
          {results.map((result) => (
            <li key={result.id}>
              <ReactMarkdown>{result.text}</ReactMarkdown>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Query;
