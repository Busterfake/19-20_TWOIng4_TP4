
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const axios = require('axios');
const api_url = "http://www.omdbapi.com/";
const api_key = "cf292f66";

let movies = [];

/* on récupère les films */
router.get('/', (req, res) => {
    // Get List of movie and return JSON
    res.status(200).json({ movies });
});

/* GET le film de l'id correspondant */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Find movie in DB
    const movie = _.find(movies, ["id", id]);
    // Return user
    res.status(200).json({
        message: 'Film found!',
        movie
    });
});

/* on ajoute un film avec son titre */
router.put('/:title', (req, res) => {
    axios.get(`${api_url}?t=${req.params.title}&apikey=${api_key}`).then(function (response) {
        // on récupère la data de l'api
        const movie = {
            id: response.data.imdbID, 
            movie: response.data.Title, 
            yearOfRelease: response.data.Year, 
            duration: response.data.Runtime,// en minutes 
            actors: response.data.Actors,  
            poster: response.data.Poster, // pochette du film
            boxOffice: response.data.BoxOffice, // total des entrées (en $$$$)
            rottenTomatoesScore: response.data.imdbRating //note du film

        };
        // documentation Axios
        // ajouter un film
        movies.push(movie);
        res.status(200).json({movies})
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
});


/* on supprime un film par son ID */
router.delete('/:id', (req, res) => {
    // Get the :id of the user we want to delete from the params of the request
    const { id } = req.params;

    // Remove from "DB"
    _.remove(movies, ["id", id]);

    // Return message
    res.json({
        message: `Just removed ${id}`
    });
});


/* UPDATE un film en renseignant son id */
router.post('/:id', (req, res) => {
    // Récup l'id du film à modifier
    const { id } = req.params;
    // Récup l'info à update
    const newNomMovie = req.body.movie;
    console.log(req.body);
    // trouve le film dans la database
    const userToUpdate = _.find(movies, ["id", id]);
    // Update
    userToUpdate.movie = newNomMovie;
    // Return message
    res.json({
        message: `Just updated ${id} with ${newNomMovie}`
    });
});

module.exports = router;