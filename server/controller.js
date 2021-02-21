const db = require('./db');

const controller = {
  getAllPokemon: (req, res) => {
    let queryStr = `SELECT pokemon.id, name, img, type
                    FROM pokemon
                    INNER JOIN types
                    ON pokemon.typeNum = types.id
                    INNER JOIN images
                    ON pokemon.imageNum = images.id;`;

    db.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  getPokemonByType: (req, res) => {
    let { type } = req.body;
    let queryStr = `SELECT pokemon.id, name, img, type
                    FROM pokemon
                    INNER JOIN types
                    ON pokemon.typeNum = types.id
                    AND types.type = "${type}"
                    INNER JOIN images
                    ON pokemon.imageNum = images.id;`;

    db.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  getTypes: (req, res) => {
    let queryStr = `SELECT * FROM types;`;

    db.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  updateName: (req, res) => {
    let { id }   = req.params;
    let { name } = req.body;
    let queryStr = `UPDATE pokemon SET name = "${name}" WHERE id = ${id};`

    db.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  deletePokemon: (req, res) => {
    let { id } = req.params;

    let typeQueryStr = `DELETE FROM types WHERE id = (SELECT typeNum FROM pokemon
                        WHERE id = ${id});`
    let imgQueryStr  = `DELETE FROM images WHERE id = (SELECT imageNum FROM pokemon
                        WHERE id = ${id});`
    let pokeQueryStr = `DELETE FROM pokemon WHERE id = ${id};`

    db.query(typeQueryStr, (err, results) => {
      if (err) res.status(404).send(err);

      db.query(imgQueryStr, (err, results) => {
        if (err) res.status(404).send(err);

        db.query(pokeQueryStr, (err, results) => {
          if (err) res.status(404).send(err);
          res.status(200).send(results);
        });
      });
    });
  },

  insertPokemon: (req, res) => {
    let { name, type, img } = req.body;
    let typeQueryStr = `INSERT INTO types (type) VALUES ("${type}");`;
    let imgQueryStr  = `INSERT INTO images (img) VALUES ("${img}");`;
    let pokeQueryStr = `INSERT INTO pokemon (name, typeNum, imageNum)
                        VALUES ("${name}", (SELECT id FROM types WHERE type = "${type}"), (SELECT id from images where img = "${img}"));`;

    db.query(typeQueryStr, (err, results) => {
      if (err) res.status(404).send(err);

      db.query(imgQueryStr, (err, results) => {
        if (err) res.status(404).send(err);

        db.query(pokeQueryStr, (err, results) => {
          if (err) res.status(404).send(err);
          res.status(200).send(results);
        });
      });
    });
  }
};

module.exports = controller;