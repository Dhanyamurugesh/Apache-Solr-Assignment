import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [collectionName, setCollectionName] = useState('');
    const [excludeColumn, setExcludeColumn] = useState('');
    const [searchColumn, setSearchColumn] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [result, setResult] = useState('');

    // API URL (adjust based on your backend server setup)
    const apiUrl = 'http://localhost:5000';

    // Function to create a collection
    const createCollection = async (name) => {
        try {
            const res = await axios.post(`${apiUrl}/createCollection`, { name });
            setResult(res.data);
        } catch (error) {
            console.error('Error creating collection', error);
        }
    };

    // Function to index data
    const indexData = async (name, column) => {
        try {
            const res = await axios.post(`${apiUrl}/indexData`, { name, excludeColumn: column });
            setResult(res.data);
        } catch (error) {
            console.error('Error indexing data', error);
        }
    };

    // Function to search data by column
    const searchByColumn = async (name, column, value) => {
        try {
            const res = await axios.post(`${apiUrl}/searchByColumn`, { name, column, value });
            setResult(res.data);
        } catch (error) {
            console.error('Error searching by column', error);
        }
    };

    // Function to delete employee by ID
    const deleteById = async (name, id) => {
        try {
            const res = await axios.post(`${apiUrl}/delEmpById`, { name, id });
            setResult(res.data);
        } catch (error) {
            console.error('Error deleting employee', error);
        }
    };

    // Function to get employee count
    const getEmployeeCount = async (name) => {
        try {
            const res = await axios.post(`${apiUrl}/getEmpCount`, { name });
            setResult(res.data);
        } catch (error) {
            console.error('Error getting employee count', error);
        }
    };

    // Function to get department facets
    const getDepFacet = async (name) => {
        try {
            const res = await axios.post(`${apiUrl}/getDepFacet`, { name });
            setResult(res.data);
        } catch (error) {
            console.error('Error getting department facet', error);
        }
    };

    return (
        <div className='container' style={{ padding: '20px' }}>
            <div>
                <h1>Solr Employee Management</h1>
                <div>
                    <h2>Create Collection</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <button onClick={() => createCollection(collectionName)}>Create Collection</button>
                </div>

                <div>
                    <h2>Index Data</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Exclude Column (e.g. Department)'
                        value={excludeColumn}
                        onChange={(e) => setExcludeColumn(e.target.value)}
                    />
                    <button onClick={() => indexData(collectionName, excludeColumn)}>Index Data</button>
                </div>

                <div>
                    <h2>Search by Column</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Column Name'
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Column Value'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button onClick={() => searchByColumn(collectionName, searchColumn, searchValue)}>Search</button>
                </div>

                <div>
                    <h2>Delete Employee by ID</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Employee ID'
                        value={employeeID}
                        onChange={(e) => setEmployeeID(e.target.value)}
                    />
                    <button onClick={() => deleteById(collectionName, employeeID)}>Delete</button>
                </div>

                <div>
                    <h2>Get Employee Count</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <button onClick={() => getEmployeeCount(collectionName)}>Get Count</button>
                </div>

                <div>
                    <h2>Get Department Facets</h2>
                    <input
                        type='text'
                        placeholder='Collection Name'
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <button onClick={() => getDepFacet(collectionName)}>Get Facet</button>
                </div>
            </div>

            <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                <h2>Result:</h2>
                <pre>
                    {Array.isArray(result) ? (
                        <div>
                            {result?.map((employee) =>
                                typeof employee === 'string' || typeof employee === 'number' ? (
                                    <div>{employee}</div>
                                ) : (
                                    <div
                                        key={employee.id}
                                        style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
                                    >
                                        <ul>
                                            {Object.entries(employee).map(([key, value]) => (
                                                <li key={key}>
                                                    <strong>{key}:</strong> {Array.isArray(value) ? value[0] : value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            )}
                        </div>
                    ) : typeof result === 'object' ? (
                        Object.entries(result)?.map(([k, v], index) => (
                            <div>
                                <span>{k}: </span>
                                <span>{v}</span>
                            </div>
                        ))
                    ) : (
                        result
                    )}
                </pre>
            </div>
        </div>
    );
}

export default App;
