const express = require('express');
const hbs = require('hbs')
const fs = require('fs');
const app = express();

// used to keep the code dry by creating partials
hbs.registerPartials(__dirname + '/views/partials');
// mentioning what the view template being used by express
app.set('view engine', 'hbs');
// specifying where the static files are kept in the project
app.use(express.static(__dirname + '/public'));
// properties to be abstracted and used in all the view files
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('author', () => {
    return 'Aniruddha SG';
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
// custom middle ware
app.use((request, response, next) => {
    let now = new Date().toString();
    let log = `${now} :: ${request.method} :: ${request.url} :: ${request.ip}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    next();
});

// asking for the root of the application
app.get('/', (request, response) => {
    response.render('home.hbs', {
        title: 'DCT Academy',
        message: 'Welcome to DCT Academy',
        placement: false,
        courses: ['Javascript', 'MEAN Stack', 'Node Js', 'Express'],
        fees: [
            {
                'Javascript': 15000
            },
            {
                'Mean Stack': 30000
            }
        ]
    });
});


app.get('/about', (request, response) => {
    response.render('about.hbs', {
        title: 'About'
    });
});

app.get('/places', (request, response) => {
    fs.readFile('places.json', (err, res) => {
        if (err) {
            response.send(err);
        } else {
            response.send(JSON.parse(res));
        }
    })
})

app.get('/places/:name', (request, response) => {
    fs.readFile('places.json', (err, res) => {
        if (err) {
            response.send(err);
        } else {
            let places = JSON.parse(res);
            let place = places.find((place) => {
                return place.name === request.params.name
            });
            if (place) {
                response.send(place);
            } else {
                response.send({
                    notice: 'Place you are looking for not found'
                })
            }
        }
    })
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});