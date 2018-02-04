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


$("#add-train").on("click", function() {
  // avoid reloading page
	event.preventDefault();

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
  // TODO: make these as nodes vs root?
	database.ref().push({
		name: name,
		destination: destination,
		frequency: frequency,
		firstTrain: firstTrain
	});

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

      var timeCalc = moment(initialTime, "HH:mm");
      // timecalc.add(freq, "m");
      //console.log(timecalc.format("HH:mm"));

      // create a moment for the time at the end of the day
      var endOfDay = moment("23:59", "HH:mm");

      // create a loop of all train times during the day
      // increment by the frequency of trains
      for (var i = timeCalc; i.isBefore(endOfDay); i.add(freq, "minutes")) {
        console.log(i.format("HH:mm"));
      }

      // var nextTrain = moment(parsed).add((snapshot.val().frequency, "m"));
      // console.log(JSON.stringify(nextTrain));
      // console.log("i am first train: " + snapshot.val().firstTrain);

      // var anotherTrain = moment(snapshot.val().firstTrain).add(20, "minutes");
      // console.log("parsed 2: " + JSON.stringify(anotherTrain));

      // var test = moment(timeString).format(timeFormat);
      // var test2 = moment(timeInput, timeFormat);
      // console.log(test2);

      // console.log(moment(snapshot.val().firstTrain).add(snapshot.val().frequency, "minutes"));

      // var monthsWorked = moment().diff(moment(snapshot.val().employeeStart), "months");
      //
      // var totalBilled = monthsWorked * snapshot.val().employeeRate;

      // create a new table row
      var newTableRow = $("<tr>");

      var newTableData =
      $("<td>" + snapshot.val().name + "</td>" +
      "<td>" + snapshot.val().destination + "</td>" +
      "<td>" + snapshot.val().frequency + "</td>" +
      "<td>" + "next arrival" + "</td>"+
      "<td>" + "minutes away" + "</td>");

      // append the row and data to the table body to display on the page
      newTableRow.append(newTableData);
      $("#table-body").append(newTableRow);

      // TODO: clear out text boxes on submit
      // name = "";
      // destination = "";
      // frequency = "";
      // firstTrain = "";

});

// function convertTimes() {
//   var timeInput = (moment(snapshot.val().firstTrain, "HH:mm Z"));
//
//   if (timeInput.isValid) {
//   console.log(timeInput);
//   return timeInput;
// }
// }
