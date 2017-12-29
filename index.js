const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-cocktail', function (req, res) {


    if (req.body.result.action == "/get-cocktail-by-ingredient") {

        let ingredientToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Ingredient ? req.body.result.parameters.Ingredient : 'Vodka';
        let reqUrl = encodeURI('http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredientToSearch);
        http.get(reqUrl, (responseFromAPI) => {
            let body = '';
            responseFromAPI.on('data', function (chunk) {
                body += chunk;
            });

            responseFromAPI.on('end', function () {
                let cocktail = JSON.parse(body)['drinks'][0];
                let dataToSend = ingredientToSearch === 'Vodka' ? 'I don\'t have the required info on that. Here\'s some info on \'Vodka\' instead.\n ' : '';
                dataToSend += cocktail['strDrink'];

                return res.json({
                    speech: dataToSend,
                    displayText: dataToSend,
                    source: 'get-cocktail-by-ingredient'
                });

            });
        }, (error) => {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'get-cocktail-by-ingredient'
            });
        });
    }
});




server.listen((process.env.PORT || 8080), function () {
    console.log("Server is up and running...");
});
