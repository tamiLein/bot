const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-cocktail-by-ingredient', function (req, res) {

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
});


server.post('/get-cocktail-by-name', function (req, res) {
    console.log("test");
    let nameToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Name ? req.body.result.parameters.Name : 'margarita';
    console.log("name; ", nameToSearch);

    let reqUrl = encodeURI('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + nameToSearch);

    console.log("url", reqUrl);
    http.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
            console.log("data");
            let cocktail = JSON.parse(chunk)['drinks'][0];
            console.log("cocktail", cocktail);
            let dataToSend = nameToSearch === 'margarita' ? 'I don\'t have the required info on that. Here\'s some info on \'margarita\' instead.\n' : '';

            console.log(dataToSend);

            dataToSend += cocktail['strDrink'];

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-cocktail-by-name'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-cocktail-by-name'
        });
    });
});


server.post('/get-cocktail-random', function (req, res) {
    console.log("test");

    //let reqUrl = encodeURI('http://www.thecocktaildb.com/api/json/v1/1/random.php');
    let reqUrl = encodeURI('http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=17122');

    console.log("url", reqUrl);
    http.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
            console.log("data");
            let cocktail = JSON.parse(chunk)['drinks'][0];
            console.log("testiiii");
            console.log("cocktail", cocktail);
            let dataToSend = '';

            console.log(dataToSend);

            dataToSend = cocktail['strDrink'];
            console.log('data sent', dataToSend);

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-cocktail-random'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-cocktail-random'
        });
    });
});


server.post('/get-movie-details', function (req, res) {

    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    let reqUrl = encodeURI('http://theapache64.xyz:8080/movie_db/search?keyword=' + movieToSearch);
    http.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
            let movie = JSON.parse(chunk)['data'];
            let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
            dataToSend += movie.name + ' is a ' + movie.stars + ' starer ' + movie.genre + ' movie, released in ' + movie.year + '. It was directed by ' + movie.director;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});




server.listen((process.env.PORT || 8080), function () {
    console.log("Server is up and running...");
});
