import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App"; // tera admin
import CustomerShop from "./CustomerShop";

function MainApp() {
  return (
    <BrowserRouter>
      {/* Top menu */}
      <div style={{ background: "black", padding: 10 }}>
        <Link to="/shop" style={{ color: "white", marginRight: 10 }}>
          Shop
        </Link>

        <Link to="/admin" style={{ color: "white" }}>
          Admin
        </Link>
      </div>

      {/* Routing */}
      <Routes>
        <Route path="/shop" element={<CustomerShop />} />
        <Route path="/admin" element={<App />} />
        <Route path="*" element={<CustomerShop />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainApp;
