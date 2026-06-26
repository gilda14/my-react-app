import "./App.css";
import { Routes, Route } from "react-router-dom";
import FirstPage from "./pages/FirstPage";
import HomePage from "./pages/HomePage";
import Secondpage from "./pages/SecondPage";
import ShoppingPage from "./pages/ShoppingPage";
import RegisterPage from "./pages/RegisterPage";
import WorkflowPage from "./components/ShoppingWorkflow";
import PaymentPage from "./pages/PaymentPage";
import MyOrderPage from "./pages/MyOrder";

function App() {
  return (
    <>
      <Routes>
        <Route path="/first-page" element={<FirstPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/second-page" element={<Secondpage />} />
        <Route path="/shopping-Page" element={<ShoppingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* New workflow page */}
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-orders" element={<MyOrderPage />} />
      </Routes>
    </>
  );
}

export default App;
