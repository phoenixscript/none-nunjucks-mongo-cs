const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();

// connect to the MongoDB database
mongoose.connect('mongodb://localhost/nodetest', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// define the schema for the userdata collection
const userdataSchema = new mongoose.Schema({
  name: String,
  sex: String,
  age: Number,
  country: String,
  dateCreated: { type: Date, default: Date.now }
});

// compile the schema into a model
const Userdata = mongoose.model('Userdata', userdataSchema);

// configure nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// middleware to serve static files
app.use(express.static('public'));


// define get routes
app.get('/', (req, res) => {

  getCountries()
    .then(countries => {
      const formData = null;
      res.render('index.html', { countries });
    })
    .catch(error => {
      console.error(error);
      res.render('index.html', { errors: [{ val: 0, msg: "Unable to load countries. Please reload the page" }] });
    });
});

// define post routes for posting the form data
app.post('/', async (req, res) => {

    // save the userdata to the database (mongo)
    const { name, sex, age, country } = req.body;

    const userdata = new Userdata({ name, sex, age, country });

    try {
      const results = await userdata.save()
      res.render('success.html', { name: req.body.name })
    }
    catch (e) {
      res.render('index.html', { errors: [e.message], formData: req.body, countries });
    }


});

// start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
  console.log('Nagivate to http://localhost:3001 to browse the application')
});

// Helper functions

// get list of countries in Europe from the REST API
const getCountries = async () => {
  return new Promise((resolve, reject) => {
    axios.get('https://restcountries.com/v3.1/region/europe')
      .then(response => {
        const data = Object.values(response.data)
        const countries = response.data.map(country => country.name.common);
        resolve(countries)
      })
      .catch(error => {
        Iconsole.error(error);
        reject(error)
      });

  })

}

// Defining the exportsƒ
module.exports = { app, getCountries }