// Initialize Firebase
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

// create variables to reference transit inputs
// initialize to avoid errors on load

var name = "";
var destination = "";
var frequency = "";
var firstTrain = "";


$("#train-form").on("submit", function() {
  // avoid reloading page
	event.preventDefault();
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

  // TODO: clear out text boxes on submit
  $("#train-form")[0].reset();
  //document.getElementById("train-form").reset();
  // resetForm.reset();

});


 database.ref().on("child_added", function(snapshot) {

 	    // log all the snapshot values
      console.log("snapshot name: " + snapshot.val().name);
      console.log("snapshot destination: " + snapshot.val().destination);
      console.log("snapshot frequency: " + snapshot.val().frequency);
      console.log("snapshot first train: " + snapshot.val().firstTrain);

      // use moment.js to calculate the train times

      // make variables pointing to database snapshot values for simplicity
      var freq = snapshot.val().frequency;
      var initialTime = snapshot.val().firstTrain;

      var timeMoment = moment(initialTime, "HH:mm");

      // create a moment for the time at the end of the day
      var endOfDay = moment("23:59", "HH:mm");

      // creare an empty array to hold all train schedules
      var timetable = [];

      var now = moment("12:43", "HH:mm");

      // create a timetable array for the day by adding frequency to first train time
      for (var i = timeMoment; i.isSameOrBefore(endOfDay); i.add(freq, "minutes")) {
        var times = i.format("HH:mm");
        timetable.push(times);
      }

      console.log(timetable);

      var now = moment("18:43", "HH:mm");
      var futureTrains = [];
      // create a variable representing now as a new moment
      // only look for trains in the future and find next one
      for (var i = 0; i < timetable.length; i++) {

        if (moment(timetable[i], "HH:mm").isAfter(now)) {
          futureTrains.push(timetable[i]);
        }
      }
      console.log(futureTrains);
      var nextTrain = futureTrains[0];
      console.log(nextTrain);

      var minutesAway = moment(nextTrain, "HH:mm").diff(now, "minutes");
      console.log(minutesAway);

      var formattedAMPM = moment(nextTrain, "HH:mm").format("h:mm a");
      console.log(formattedAMPM);


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

function validateForm() {
  var firstTrainTimes = $("#first-train").val().trim().split(":");

  if (!validateFirstTrainTime(firstTrainTimes[0], firstTrainTimes[1])) {
    return false;
  }

  return true;
}

function validateFirstTrainTime(hours, minutes) {
  if (!((hours >= 00 || hours >= 0) && (hours <= 23))) {
    return false;
  }
  if (!((minutes >= 00) && (minutes <= 59))) {
    return false;
  }
  return true;
}
