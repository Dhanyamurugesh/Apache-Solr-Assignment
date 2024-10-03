// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [collectionName, setCollectionName] = useState('');
    const [phoneCollection, setPhoneCollection] = useState('');
    const [results, setResults] = useState([]);

    const createCollections = async () => {
        await axios.post('http://localhost:5000/createCollection', { collectionName });
        await axios.post('http://localhost:5000/createCollection', { phoneCollection });
    };

    const getEmpCount = async () => {
        const res = await axios.get(`http://localhost:5000/getEmpCount/${collectionName}`);
        alert(`Employee Count: ${res.data.count}`);
    };

    const searchByColumn = async (column, value) => {
        const res = await axios.get(`http://localhost:5000/searchByColumn?collectionName=${collectionName}&columnName=${column}&columnValue=${value}`);
        setResults(res.data);
    };

    return (
        <div>
            <h1>Employee Directory</h1>
            <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="Collection Name" />
            <input value={phoneCollection} onChange={(e) => setPhoneCollection(e.target.value)} placeholder="Phone Collection" />
            <button onClick={createCollections}>Create Collections</button>
            <button onClick={getEmpCount}>Get Employee Count</button>
            <button onClick={() => searchByColumn('Department', 'IT')}>Search by Department (IT)</button>
            <button onClick={() => searchByColumn('Gender', 'Male')}>Search by Gender (Male)</button>
            <div>
                {results.map(emp => (
                    <div key={emp.employeeId}>{emp.name} - {emp.department}</div>
                ))}
            </div>
        </div>
    );
}

export default App;
