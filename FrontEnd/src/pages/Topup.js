import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";


export default () => {
  const [gopay, setGopay] = useState("");
  const [rekening, setRekening] = useState("");
  const [cash, setCash] = useState("");
  const [error, setError] = useState("");
  const [berhasilIsi, setBerhasilIsi] = useState(false)
  const token = localStorage.getItem("token")

  const handleGopayChange = (event) => {
    setGopay(event.target.value);
  };

  const handleRekeningChange = (event) => {
    setRekening(event.target.value);
  };

  const handleCashChange = (event) => {
    setCash(event.target.value);
  };

  const user_depo = {
    id: localStorage.getItem("user_id"),
    uang_gopay: gopay,
    uang_cash: cash,
    uang_rekening: rekening,
  };

  const postDepo = (event) => {
    event.preventDefault();
    if (!gopay || !rekening || !cash) {
      setError("masukkan saldo anda!");
      return;
    } else {
      console.log(user_depo);
      axios
        .post(
          "http://localhost:5000/user/newdepo", user_depo, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
          alert("Berhasil input uang anda!");
          setBerhasilIsi(true);
        })
        .catch((err) => {
          alert("token expired, pastikan login kembali!")
          setError(true)
        });
    }
  };
  
  if (berhasilIsi){
    return <Navigate to='/table'/>;
  }

  if (error) {
    return <Navigate to="/" />;
  }

  return (
    <form>
      <label>
        Masukkan saldo gopay :
        <input type="text" value={gopay} onChange={handleGopayChange} />
      </label>
      <br />
      <label>
        Masukkan saldo rekening :
        <input type="text" value={rekening} onChange={handleRekeningChange} />
      </label>
      <br />
      <label>
        Masukan saldo cash :
        <input type="text" value={cash} onChange={handleCashChange} />
      </label>
      <br />
      {error && <p>{error}</p>}
      <button onClick={postDepo} type="submit">
        Input
      </button>
    </form>
  );
}

