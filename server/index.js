// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SOLR_URL = 'http://localhost:8000/solr'; // Adjust based on your Solr setup


// Function to create a collection
app.post('/createCollection', async (req, res) => {
    const { name } = req.body;
    try {
        await axios.post(`${SOLR_URL}/admin/collections?action=CREATE&name=${name}&numShards=1&replicationFactor=1&maxShardsPerNode=1`);
        res.send(`Collection ${name} created.`);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to index data
app.post('/indexData', async (req, res) => {
    const { name, excludeColumn } = req.body;
    const data = require('./employee_data.json'); // Load your JSON data here

    // Prepare data excluding the specified column
    const indexedData = data.map(emp => {
        const { [excludeColumn]: _, ...rest } = emp;
        return rest;
    });

    try {
        await axios.post(`${SOLR_URL}/${name}/update?commit=true`, indexedData);
        res.send('Data indexed successfully.');
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to search by column
app.post('/searchByColumn', async (req, res) => {
    const { name, column, value } = req.body;
    try {
        const response = await axios.get(`${SOLR_URL}/${name}/select?q=${column}:${value}`);
        res.json(response.data.response.docs);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to get employee count
app.post('/getEmpCount', async (req, res) => {
    const { name } = req.body;
    try {
        const response = await axios.get(`${SOLR_URL}/${name}/select?q=*:*&rows=0`);
        res.json({ count: response.data.response.numFound });
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to delete employee by ID
app.post('/delEmpById', async (req, res) => {
    const { name, id } = req.body;
    try {
        await axios.post(`${SOLR_URL}/${name}/update?commit=true`, [{ delete: { id: id } }]);
        res.send(`Employee ${id} deleted.`);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Function to get department facets
app.post('/getDepFacet', async (req, res) => {
    const { name } = req.body;
    try {
        const response = await axios.get(`${SOLR_URL}/${name}/select?q=*:*&facet=true&facet.field=Department`);
        res.json(response.data.facet_counts.facet_fields.Department);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
