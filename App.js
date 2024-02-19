// App.js
import React from "react";
import Header from "./Header";
import WalletApp from "./WalletApp";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <WalletApp />
      </div>
    </div>
  );
}

export default App;
