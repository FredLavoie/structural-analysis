/********************************** REQUIRED PACKAGES / PORT *****************************************/
/*****************************************************************************************************/
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const fs            = require('fs');
const { execFile }  = require('child_process');
const PORT          = process.env.PORT || 8080; // default port 8080

/************************************* SET / USE / LISTEN ********************************************/
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

app.post('/results', (req, res) => {
  console.log('rendering results.ejs');

  let dataString = '';
  let dataArr = [];
  for(let key in req.body) {
    dataArr.push(req.body[key]);
  }

  for(let i = 0; i < dataArr.length; i++){
    if(i < 6) {
      dataString += dataArr[i] + ' ';
    } else {
      dataString += '\r\n' + dataArr[i];
    }
  }
  
  // code will write to the input file
  fs.writeFile('program/data_in.txt', dataString, function(error) {
    if (error) {
      throw error;
    }
    // code to run executable, then render 'results' page
    execFile("program/FrameAnalysisExec", function(error) {
      if (error) {
        console.log('There was an error running the executable');
        res.render('error');
      }
      res.render('results');
    });

  });

});



