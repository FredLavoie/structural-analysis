/********************************** REQUIRED PACKAGES / PORT *****************************************/
/*****************************************************************************************************/
const express				= require('express');
const bodyParser			= require('body-parser');
const app					= express();
const fs					= require('fs');
const { execFile }			= require('child_process');
const PORT					= process.env.PORT || 8080; // default port 8080
const createInputObject		= require('./create-input-object');
const createInputString		= require('./create-input-string');

/************************************* SET / USE / LISTEN ********************************************/
/*****************************************************************************************************/

app.set('view engine', 'ejs');
app.set('views','public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('program'));

app.listen(PORT, () => {
	console.log(`structural_analysis app listening on port ${PORT}`);
});

/**************************************** GET REQUEST ************************************************/
/*****************************************************************************************************/

app.get('/', (req, res) => {
	console.log('rendering index.ejs');
	res.render('index');
});

app.get('/documentation', (req, res) => {
	console.log('rendering documentation.ejs');
	res.render('documentation');
});


/*************************************** POST REQUEST ************************************************/
/*****************************************************************************************************/

app.post('/results', (req, res) => {
	console.log('rendering results.ejs');
	
	let inputObject = createInputObject(req.body);
	let dataString = createInputString(inputObject);

	// code to write to the input file
	fs.writeFile('program/data_in.txt', dataString, function(error) {
		if (error) {
			console.log('There was an error writing the input file');
			console.log(error);
			res.render('error-write');
			return;
		}
		// code to run executable, then render 'results' page
		execFile('program/sa-linux-exec', function(error) {
			if (error) {
				console.log('There was an error running the executable');
				console.log(error);
				res.render('error-exec');
				return;
			}
			fs.readFile('program/data_string.json', 'utf-8', function(error, data) {
				if(error) console.log(error);
			});
			res.render('results');
		});
	});
});



