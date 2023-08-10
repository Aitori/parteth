import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PartyPage from "./partyPage";

async function loader() {
  const party = "ff";
  return { party };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    ),
  },
  {
    path: "/aa/:aid",
    element: <PartyPage/>,
    loader: loader
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
