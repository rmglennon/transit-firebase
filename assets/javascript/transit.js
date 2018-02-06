// initialize Firebase
var config = {
  apiKey: "AIzaSyC1-lfMm-ICxtXmyZYMaB8kS4it_jaZODI",
  authDomain: "transit-schedules.firebaseapp.com",
  databaseURL: "https://transit-schedules.firebaseio.com",
  projectId: "transit-schedules",
  storageBucket: "",
  messagingSenderId: "531882819109"
};

firebase.initializeApp(config);

// create a variable to reference the Firebase database
var database = firebase.database();

// create variables to reference train inputs
// initialize to avoid errors on load

var name = "";
var destination = "";
var frequency = "";
var firstTrain = "";

// run when the form is submitted
$("#train-form").on("submit", function() {

  // avoid reloading page
  event.preventDefault();

  // make sure inputs are valid before submitting
  if (!validateForm()) {
    return false;
  }

  // set variable values to input captured in form
  name = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();
  firstTrain = $("#first-train").val().trim();

  // create nodes in Firebase with variable names
  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain
  });

  // clear values in the form when successfully submitted
  $("#train-form")[0].reset();

});

// run when a new child is added
database.ref().on("child_added", function(snapshot) {

  // make new variables pointing to database snapshot values for simplicity
  var freq = snapshot.val().frequency;
  var initialTime = snapshot.val().firstTrain;

  // call functions to calculate the next train and arrival times
  var nextTrain = calculateNextTrains(freq, initialTime);
  var times = calculateArrivalTime(nextTrain);
  var formattedAMPM = times[0];
  var minutesAway = times[1];

  // update the list of upcoming trains

  // create a new table row and table data in it
  var newTableRow = $("<tr>");

  var newTableData =
  $("<td id='table-train-name'>" + snapshot.val().name + "</td>" +
  "<td id='table-train-destination'>" + snapshot.val().destination + "</td>" +
  "<td id='table-train-frequency'>" + snapshot.val().frequency + "</td>" +
  "<td id='table-train-arrival'>" + formattedAMPM + "</td>"+
  "<td id='table-train-minutes'>" + minutesAway + "</td>");

  // append the row and data to the table body to display on the page
  newTableRow.append(newTableData);
  $("#table-body").append(newTableRow);

});

// use moment.js to calculate the train times by building the entire day's schedule
function calculateNextTrains(freq, initialTime) {

  // create a moment for initial time and format it
  var timeMoment = moment(initialTime, "HH:mm");

  // create a moment for the time at the end of the day
  var endOfDay = moment("23:59", "HH:mm");

  // create an empty array to hold all train departure times for the day
  var timetable = [];

  // create a timetable array for the day by adding frequency to first train time
  // Note: this assumes the train runs at the same frequency all day
  for (var i = timeMoment; i.isSameOrBefore(endOfDay); i.add(freq, "minutes")) {
    var times = i.format("HH:mm");
    timetable.push(times);
  }

  // create a variable representing now as a new moment
  var now = moment();

  // create a variable to hold trains that depart after the current time
  var futureTrains = [];

  // only look for trains in the future and find next one
  for (var i = 0; i < timetable.length; i++) {
    if (moment(timetable[i], "HH:mm").isAfter(now)) {
      futureTrains.push(timetable[i]);
    }
  }

  // the next train is the first one [0] in the array of departures remaining for the day
  var nextTrain = futureTrains[0];

  return nextTrain;

}

// use moment.js to calculate the minutes until the next train
function calculateArrivalTime(nextTrain) {
  var now = moment();
  var minutesAway = moment(nextTrain, "HH:mm").diff(now, "minutes");
  var formattedAMPM = moment(nextTrain, "HH:mm").format("h:mm a");
  return [formattedAMPM, minutesAway];
}

// validate the items on the train input form
// "require" is set on the html fields to ensure there is an input
function validateForm() {
  // collect the train input value and split it at the :
  var firstTrainTimes = $("#first-train").val().trim().split(":");

  if (!validateFirstTrainTime(firstTrainTimes[0], firstTrainTimes[1])) {
    return false;
  }
  return true;
}

// validate that the hours and minutes are within expected range
function validateFirstTrainTime(hours, minutes) {
  if (!((hours >= 00 || hours >= 0) && (hours <= 23))) {
    return false;
  }
  if (!((minutes >= 00) && (minutes <= 59))) {
    return false;
  }
  return true;
}
