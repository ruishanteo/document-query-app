import "./App.css";
import Upload from "./components/Upload";
import Query from "./components/Query";

function App() {
  return (
    <div className="App">
      <h1>Document Vector Search App</h1>
      <Upload />
      <Query />
    </div>
  );
}

export default App;
