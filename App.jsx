import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="container">

      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("about")}>About</button>
        <button onClick={() => setPage("contact")}>Contact</button>
      </nav>

      {page === "home" && (
        <div>
          <h1>Home</h1>
          <p>Welcome to my Error Detection Project</p>
        </div>
      )}

      {page === "about" && (
        <div>
          <h1>About</h1>
          <p>This project detects errors in input data.</p>
        </div>
      )}

      {page === "contact" && (
        <div>
          <h1>Contact</h1>
          <p>Email: your@email.com</p>
        </div>
      )}

    </div>
  );
}

export default App;