import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [date, setDate] = useState("");

    const [succed, setSucced] = useState(false);
    const [error, setError]= useState(false);

    const token = localStorage.getItem("token")

    const formCatatan = {
        title: title,
        body: body,
        date: date,
        user_id: localStorage.getItem("user_id"),
    };


    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleBody = (event) => {
        setBody(event.target.value);
    };

    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const tambahHandler = (event) => {
        event.preventDefault();
        axios
        .post("http://localhost:5000/user/catatan", formCatatan, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            // console.log(response.data.user_id)s
            alert("Berhasil tambah catatan!");
            setSucced(true);
        })
        .catch((err) => {
            alert("token expired, silahkah login kembali!");
            setError(true);
        });
    };

    if (succed) {
        return <Navigate to="/catatan" />;
    }

    if (error) {
        return <Navigate to="/" />;
    }

    return (
        <form>
        <label>Judul</label>
        <br />
        <input type="text" value={title} onChange={handleTitle} />
        <br />
        <br />
        <label>Deskripsi</label>
        <br />
        <input type="text" value={body} onChange={handleBody} />
        <br />
        <br />
        <label>Tanggal</label>
        <br />
        <input type="date" value={date} onChange={handleDate} />
        <br />
        <br />
        <button type="submit" onClick={tambahHandler}>
            Tambah
        </button>
        </form>
    );
};
