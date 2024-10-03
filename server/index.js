// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SOLR_URL = 'http://localhost:8983/solr'; // Adjust based on your Solr setup

// Function to create a collection
app.post('/createCollection', async (req, res) => {
    const { collectionName } = req.body;
    try {
        await axios.post(`${SOLR_URL}/admin/collections?action=CREATE&name=${collectionName}`);
        res.send(`Collection ${collectionName} created.`);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to index data
app.post('/indexData', async (req, res) => {
    const { collectionName, excludeColumn } = req.body;
    const data = require('./employee_data.json'); // Load your JSON data here

    // Prepare data excluding the specified column
    const indexedData = data.map(emp => {
        const { [excludeColumn]: _, ...rest } = emp;
        return rest;
    });

    try {
        await axios.post(`${SOLR_URL}/${collectionName}/update?commit=true`, indexedData);
        res.send('Data indexed successfully.');
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to search by column
app.get('/searchByColumn', async (req, res) => {
    const { collectionName, columnName, columnValue } = req.query;
    try {
        const response = await axios.get(`${SOLR_URL}/${collectionName}/select?q=${columnName}:${columnValue}`);
        res.json(response.data.response.docs);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to get employee count
app.get('/getEmpCount/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    try {
        const response = await axios.get(`${SOLR_URL}/${collectionName}/select?q=*:*&rows=0`);
        res.json({ count: response.data.response.numFound });
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to delete employee by ID
app.delete('/delEmpById/:collectionName/:employeeId', async (req, res) => {
    const { collectionName, employeeId } = req.params;
    try {
        await axios.post(`${SOLR_URL}/${collectionName}/update?commit=true`, [{ delete: { id: employeeId } }]);
        res.send(`Employee ${employeeId} deleted.`);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to get department facets
app.get('/getDepFacet/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    try {
        const response = await axios.get(`${SOLR_URL}/${collectionName}/select?q=*:*&facet=true&facet.field=Department`);
        res.json(response.data.facet_counts.facet_fields.Department);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
