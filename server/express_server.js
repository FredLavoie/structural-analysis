/******************************************** REQUIRED PACKAGES / PORT ***********************************************/
/*********************************************************************************************************************/
const express	      			= require('express');
const bodyParser			    = require('body-parser');
const app				        	= express();
const fs					        = require('fs');
const { execFile }	  		= require('child_process');
const PORT					      = process.env.PORT || 8080; // default port 8080
const validateForm        = require('./lib/validateformServer');
const createInputObject		= require('./lib/create-input-object');
const createInputString		= require('./lib/create-input-string');

/*********************************************** SET / USE / LISTEN **************************************************/
/*********************************************************************************************************************/

app.set('view engine', 'ejs');
app.set('views','public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('program'));

app.listen(PORT, () => {
  console.log(`structural_analysis app listening on port ${PORT}`);
});

/************************************************** GET REQUEST ******************************************************/
/*********************************************************************************************************************/

app.get('/', (req, res) => {
  console.log('rendering index.ejs');
  res.render('index');
});

app.get('/documentation', (req, res) => {
  console.log('rendering documentation.ejs');
  res.render('documentation');
});

app.get('/results', (req, res) => {
  console.log('rendering results.ejs');
  res.render('results');
});

app.get('/rerror-write', (req, res) => {
  console.log('rendering rerror-write.ejs');
  res.render('rerror-write');
});

app.get('/error-exec', (req, res) => {
  console.log('rendering error-exec.ejs');
  res.render('error-exec');
});

app.get('/error-input', async (req, res) => {
  console.log('rendering error-input.ejs');
  const validForm = await validateForm(req.body);
  res.render('error-input', validForm);
});

/************************************************* POST REQUEST ******************************************************/
/*********************************************************************************************************************/

app.post('/results', async (req, res) => {
  // console.log(req.body);
  const validForm = await validateForm(req.body);
  console.log(validForm);


  if (validForm.valid === false) {
    res.send({ message: 'wrong_input' });
  } else {
    res.send({ message: 'success' });
  }

  // const inputObject = await createInputObject(req.body);
  // const dataString = await createInputString(inputObject);

  // // code to write to the input file
  // fs.writeFile('program/data_in.txt', dataString, (error) => {
  //   if (error) {
  //     console.log('There was an error writing the input file');
  //     console.log(error);
  //     res.send({ message: 'Error: write file' });
  //     return;
  //   }
  //   // code to run executable, then render 'results' page
  //   execFile('program/sa-mac-exec', (error) => {
  //     if (error) {
  //       console.log('There was an error running the executable');
  //       console.log(error);
  //       res.send({ message: 'Error: executing program' });
  //       return;
  //     }
  //     fs.readFile('program/data_string.json', 'utf-8', (error, data) => {
  //       // console.log('JSON data results object: ', JSON.parse(data));
  //       if (error) console.log(error);
  //     });
  //     res.send({ message: 'Success' });
  //   });
  // });

});



