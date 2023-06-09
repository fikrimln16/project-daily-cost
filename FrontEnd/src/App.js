import "./styles/App.css";
import React, { useState } from "react";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Table from "./pages/Table";
import Register from "./pages/Register";
import Topup from "./pages/Topup";
import Belanja from "./pages/Belanja";
import Catatan from "./pages/Catatan";
import AddCatatan from "./pages/AddCatatan";
import LoginGoogle from "./pages/LoginGoogle";

const isAuth = false;

// function PrivateRoute({ children, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={() => {
//         if (isAuth) {
//           return children;
//         } else {
//           return <Navigate to="/login" />;
//         }
//       }}
//     />
//   );
// }

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/table" element={<Table/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/topup" element={<Topup/>} />
          <Route exact path="/belanja" element={<Belanja/>} />
          <Route exact path="/catatan" element={<Catatan/>} />
          <Route exact path="/tambah-catatan" element={<AddCatatan/>} />
          <Route exact path="/google" element={<LoginGoogle/>} />
        </Routes>
      </Router>
    </div>
  );
}
