import "./App.css";
import { Routes, Route } from "react-router-dom";
import FirstPage from "./pages/FirstPage";
import HomePage from "./pages/HomePage";
import Secondpage from "./pages/SecondPage";
import ShoppingPage from "./pages/ShoppingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/first-page" element={<FirstPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/second-page" element={<Secondpage />} />
        <Route path="/shopping-Page" element={<ShoppingPage />} />
      </Routes>
    </>
  );
}

export default App;
