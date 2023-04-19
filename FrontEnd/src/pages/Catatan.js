import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Navigate } from "react-router-dom";

export default () => {
    const [artikel, setArtikel] = useState([]);
    const user_id = localStorage.getItem("user_id")

    const [kembali, setKembali] = useState(false)
    const [tambah, setTambah] = useState(false)


    const getCatatan = async () => {
        try{
            let res = await axios.get(`http://localhost:5000/user/catatan/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            setArtikel(res.data.data)
            console.log(res.data.results)
            console.log(tanggal)
        } catch (error) {
            console.log(error.message)
        }
    }

    const Back = (event) => {
        event.preventDefault();
        setKembali(true);
    };

    const TambahCatatan = (event) => {
        event.preventDefault();
        setTambah(true);
    }

    useEffect(() => {
        getCatatan();
    }, []);

    if(kembali){
        return <Navigate to='/table'/>;
    }

    if(tambah){
        return <Navigate to='/tambah-catatan'/>;
    }

    return (
        <div>
        <h1>Daftar Artikel</h1>
        {artikel.map(item => (
            <div key={item.catatan_id}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <p>{item.created_at}</p>
            <img src={item.url} style={{ width: '200px' }}></img>
            </div>
        ))}
        <button onClick={TambahCatatan} type="submit">
            Tambah Catatan
        </button>
        <button onClick={(event) => {
                    event.preventDefault();
                    setKembali(true);
                }} type="submit">
            Back
        </button>
        </div>
    );
}

