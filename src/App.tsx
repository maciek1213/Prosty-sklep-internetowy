import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CartPage from "./components/CartPage";
import OrderPage from "./components/OrderPage";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [orderValue, setOrderValue] = useState<number>(0);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onLogout={() => {
                setToken(null);
                localStorage.removeItem("token");
              }}
            />
          }
        />
        <Route
          path="/cart"
          element={<CartPage setOrderValue={setOrderValue}></CartPage>}
        />
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route path="/register" element={<RegisterPage onLogin={setToken} />} />
        <Route path="/order" element={<OrderPage orderValue={orderValue} />} />
      </Routes>
    </Router>
  );
}

export default App;
