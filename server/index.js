const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const controller = require('./controller');

const app = express();

app.use(morgan('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/allPokemon', controller.getAllPokemon)
   .get('/api/allTypes', controller.getTypes)
   .post('/api/filteredPokemon', controller.getPokemonByType)
   .post('/api/insertPokemon', controller.insertPokemon)
   .put('/api/updateName/:id', controller.updateName)
   .delete('/api/deletePokemon/:id', controller.deletePokemon);

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));