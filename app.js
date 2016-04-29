// load in libraries
var fs = require('fs');
var path = require('path');
var kickbox = require('kickbox').client('f9dfda6dbf76f5bf7083718c05580562bf2bd483b9364dfda9029875344acbf4').kickbox();

// init default values
var addr = "pnob32@gmail.com";
var inputSrc = "test-input.csv";
var validOutputSrc = "valid.csv";
var invalidOutputSrc = "invalid.csv";

// declare email data structure
var emails = [];
var validEmails = [];
var invalidEmails = [];

// check argument length to provide proper errors to user
if (process.argv.length > 3) {
  console.log("WARNING: this script is designed to take 1 cmd line argument in the form of an input csv file!");
}
if (process.argv.length <= 2) {
  console.log("WARNING: no input .csv given. Default input file is " + inputSrc);
}
else {
  // load cmd line arg if provided
  inputSrc = process.argv[2];
}

console.log("parsing emails from csv file: " + inputSrc);

// setup input path correctly
inputSrc = path.join(__dirname, inputSrc);

// attempt to read input file. Will throw error if input file doesn't exist
fs.readFile(inputSrc, {encoding: 'utf8'}, function(err, contents) {
  if (err) {
    console.log("Problem opening file... most likely file does not exist or is being blocked by permissions");
    throw err;
  }
  
  // setting up output files... creating and/or clearing
  console.log("setting up output files: " + validOutputSrc + " and " + invalidOutputSrc);
  validOutputSrc = path.join(__dirname, validOutputSrc);
  invalidOutputSrc = path.join(__dirname, invalidOutputSrc);
  fs.writeFile(validOutputSrc, '', function(err) {
    if (err) throw err;
  });
  fs.writeFile(invalidOutputSrc, '', function(err) {
    if (err) throw err;
  });
  
  // parse simple csv file (emails only)
  emails = contents.split(",");
  
  // step through each to determine validity
  emails.forEach(function(val, i, emailArray) {
    console.log("checking " + val);
    
    // using kickbox to ping email address
    kickbox.verify(val, {timeout: 6000}, function(err, res) {
      if (err) {
        console.log("error thrown: " + err);
      }
      else if (res.body.result === 'deliverable') {
        fs.appendFile(validOutputSrc, val + ',', function(err) {
          if (err) throw err;
        });
      }
      else {
        fs.appendFile(invalidOutputSrc, val + ',', function(err) {
          if (err) throw err;
        });
      }
    });
  });
});
