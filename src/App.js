import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import PartyPage from "./partyPage";
import { Button } from "@nextui-org/react";

async function loader({ params }) {
  const party = params.aid;
  return { party };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <header className="App-header">
          <div className="px-16">Attendstation</div>
          <Link to="/aa/edit">
            <Button>Create</Button>
          </Link>
        </header>
      </div>
    ),
  },
  {
    path: "/aa/:aid",
    element: <PartyPage />,
    loader: loader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
