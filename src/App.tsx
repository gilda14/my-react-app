import './App.css'
import { Routes, Route } from "react-router-dom"
import FirstPage from "./pages/FirstPage"
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/first-page" element={<FirstPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
