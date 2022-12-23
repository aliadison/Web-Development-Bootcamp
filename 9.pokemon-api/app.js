const express = require("express");
const https = require("node:https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.post("/", function (request, response) {

  const pokemonName = request.body.pokemonName;
  https
    .get("https://pokeapi.co/api/v2/pokemon/" + pokemonName, (res) => {
      console.log("statusCode:", res.statusCode);

      let pokemonData = "";
      res.on("data", (d) => {
        pokemonData += d; // this function gets called about 4 times.
      });

      res.on("end", function () {
        const pokemonJson = JSON.parse(pokemonData);
        const pokemonAbility = pokemonJson.abilities[1].ability.name;
        const pokemonImage =
          pokemonJson.sprites.other.dream_world.front_default;
        response.write(
          "<h1>"+pokemonName+" has " + pokemonAbility + " ability.</h1>"
        );
        response.write("<img src='" + pokemonImage + "'/>");
        response.send(); // And when it's done, show it in the browser.
      });
    })
    .on("error", (e) => {
      console.error(e);
    });
});

app.listen(3000, function () {
  console.log("App is running on port 3000");
});
