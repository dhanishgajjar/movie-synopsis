// Require https
const https = require('https');
var colors = require('colors');

// Function to print out the movie details
function print(title, year, rating, synopsis) {

	const report = `

${colors.bold.red(title)}

Year of Release: ${colors.bold.cyan(year)} - Rating: ${colors.bold.yellow(rating)}

Synopsis: ${colors.green(synopsis)}
`
		console.log(report);
}

// Primary Function that fetches the data
function fetchMovie(type, keyword) {

	// A Simple if else condition to replace api specific parameters with custom ones
	if (type === "search") {
		type = "query_term";
	}

	// Connecting to the API
	const request = https.get(`https://yts.am/api/v2/list_movies.json?${type}=${keyword}`, response => {
		let body = '';

		response.on('data', data => {
			body += data.toString();
	});

		response.on('end', () => {

			// Since the api is designed well, after the parsing,
			// with any combination of parameters the data received is always
			// data > movies > the list of movies
			const movieData = JSON.parse(body);
			const movies = movieData.data.movies;

			// Given the array of movies, a variable of movie is assigned
			// to a single object, and then we loop over all the items to get
			// the specific required properties are accessed
			// title, year, rating, synopsis
			for (let movie of movies ) {
				print(movie.title, movie.year, movie.rating, movie.synopsis);
			}
		});
	});
}

// The first argument in the command line will be the type of parameter - "search" or "genre"
const type = process.argv[2];

// As you notice here, the third is missing, which is intentional.
// So you can type $ node movie.js search for "lord of the rings" or genre of action

// The second argument in the command line will be the keyword - any keyword or type of genre
const keyword = process.argv.slice(4);

// Looping over the entire list of movies and printing the ones that match the keyword or genre
let i = 0;
let arrayLength = keyword.length;
for (; i < arrayLength; i++) {
	fetchMovie(type, keyword[i]);
}