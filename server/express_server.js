/******************************************** REQUIRED PACKAGES / PORT ***********************************************/
/*********************************************************************************************************************/
const express	            = require('express');
const bodyParser          = require('body-parser');
const app                 = express();
const fs                  = require('fs');
const { execFile }        = require('child_process');
const PORT                = process.env.PORT || 8080; // default port 8080
const validateForm        = require('./lib/validateformServer');
const createInputObject   = require('./lib/create-input-object');
const createInputString   = require('./lib/create-input-string');

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

app.get('/results-json', (req, res) => {
  fs.readFile('program/data_out.json', 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
      console.log('There was an error reading the output JSON file');
      res.render('error-exec');
      return;
    }
    const parsedData = JSON.parse(data);
    res.send(parsedData);
  });
});

/************************************************* POST REQUEST ******************************************************/
/*********************************************************************************************************************/

app.post('/results', async (req, res) => {
  const validForm = await validateForm(req.body);

  if (validForm.valid === false) {
    res.render('error-input', validForm);
    return;
  }

  const inputObject = await createInputObject(req.body);
  const dataString = await createInputString(inputObject);

  // code to write to the input file
  fs.writeFile('program/data_in.txt', dataString, (error) => {
    if (error) {
      console.log('There was an error writing the input file');
      console.log(error);
      res.render('error-write');
      return;
    }
    // code to run executable, then render 'results' page
    execFile('program/sa-mac-exec', (error) => {
      if (error) {
        console.log('There was an error running the executable');
        console.log(error);
        res.render('error-exec');
        return;
      }
      console.log('rendering results.ejs');
      res.render('results');
    });
  });
});



