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

  // test everything
  console.log(name);
  console.log(destination);
  console.log(frequency);
  console.log(firstTrain);

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

  // log all the snapshot values
  console.log("snapshot name: " + snapshot.val().name);
  console.log("snapshot destination: " + snapshot.val().destination);
  console.log("snapshot frequency: " + snapshot.val().frequency);
  console.log("snapshot first train: " + snapshot.val().firstTrain);

  // // use moment.js to calculate the train times by calculating the entire day's schedule
  //
  // // make variables pointing to database snapshot values for simplicity
  var freq = snapshot.val().frequency;
  var initialTime = snapshot.val().firstTrain;

  var nextTrain = calculateNextTrains(freq, initialTime);


var times = calculateArrivalTime(nextTrain);
var formattedAMPM = times[0];
var minutesAway = times[1];



  //
  // // create a moment for initial time and format it
  // var timeMoment = moment(initialTime, "HH:mm");
  //
  // // create a moment for the time at the end of the day
  // var endOfDay = moment("23:59", "HH:mm");
  //
  // // creare an empty array to hold all train departure times for the day
  // var timetable = [];
  //
  // // create a timetable array for the day by adding frequency to first train time
  // // Note: this assumes the train runs at the same frequency all day
  // for (var i = timeMoment; i.isSameOrBefore(endOfDay); i.add(freq, "minutes")) {
  //   var times = i.format("HH:mm");
  //   timetable.push(times);
  // }
  //
  // console.log(timetable);
  //
  // // create a variable representing now as a new moment
  // var now = moment();
  //
  // // create a variable to hold trains that depart after the current time
  // var futureTrains = [];
  //
  // // only look for trains in the future and find next one
  // for (var i = 0; i < timetable.length; i++) {
  //
  //   if (moment(timetable[i], "HH:mm").isAfter(now)) {
  //     futureTrains.push(timetable[i]);
  //   }
  // }
  //
  // console.log(futureTrains);
  // the next train is the first one [0] in the array of departures remaining for the day
  // var nextTrain = futureTrains[0];
  // console.log(nextTrain);

  // use moment.js to calculate the difference between now and the next train and at what time it will depart (formatted in AM/PM style)
  // var now = moment();
  // var nextTrain = calculateNextTrains(freq, initialTime);
  // var minutesAway = moment(nextTrain, "HH:mm").diff(now, "minutes");
  // console.log(minutesAway);
  //
  // var formattedAMPM = moment(nextTrain, "HH:mm").format("h:mm a");
  // console.log(formattedAMPM);



  // update the user interface list of upcoming trains

  // create a new table row
  var newTableRow = $("<tr>");

  var newTableData =
  $("<td>" + snapshot.val().name + "</td>" +
  "<td>" + snapshot.val().destination + "</td>" +
  "<td>" + snapshot.val().frequency + "</td>" +
  "<td>" + formattedAMPM + "</td>"+
  "<td>" + minutesAway + "</td>");

  // append the row and data to the table body to display on the page
  newTableRow.append(newTableData);
  $("#table-body").append(newTableRow);

});



function calculateNextTrains(freq, initialTime) {
  // use moment.js to calculate the train times by calculating the entire day's schedule

  // create a moment for initial time and format it
  var timeMoment = moment(initialTime, "HH:mm");

  // create a moment for the time at the end of the day
  var endOfDay = moment("23:59", "HH:mm");

  // creare an empty array to hold all train departure times for the day
  var timetable = [];

  // create a timetable array for the day by adding frequency to first train time
  // Note: this assumes the train runs at the same frequency all day
  for (var i = timeMoment; i.isSameOrBefore(endOfDay); i.add(freq, "minutes")) {
    var times = i.format("HH:mm");
    timetable.push(times);
  }

  console.log(timetable);

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

  console.log(futureTrains);
  // the next train is the first one [0] in the array of departures remaining for the day
  var nextTrain = futureTrains[0];
  console.log(nextTrain);

return nextTrain;

}


function calculateArrivalTime(nextTrain) {
  var now = moment();
  var minutesAway = moment(nextTrain, "HH:mm").diff(now, "minutes");
  var formattedAMPM = moment(nextTrain, "HH:mm").format("h:mm a");
  console.log("from calculateArrivalTime " + formattedAMPM);
  console.log("from calculateArrivalTime " + minutesAway);
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
