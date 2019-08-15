/********************************** REQUIRED PACKAGES / PORT *****************************************/
/*****************************************************************************************************/
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const PORT          = process.env.PORT || 8080; // default port 8080
const fs            = require('fs');
const { execFile }  = require('child_process');

/************************************* SET / USE / LISTEN *********************************************/
/*****************************************************************************************************/

app.set('view engine', 'ejs');
app.set('views','./public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('program'));

app.listen(PORT, () => {
	console.log(`structural_analysis app listening on port ${PORT}!`);
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

app.post('/submit', (req, res) => {
  
  console.log('this is req.body: ', req.body);
  

  // code will write to the input file
  // fs.writeFile('program/data_in.txt', 'utf-8', function(error, data) {
  //   if (error) {
  //     throw error;
  //   }

  //   res.render('results');
  // });

  /*
  // code to run executable, then render 'results' page
  execFile("program/FrameAnalysisExec", function(error) {
    if (error) {
      console.log('There was an error running the executable');
      throw error;
    }
    res.render('results');
  });
  */

 res.render('results');

});



