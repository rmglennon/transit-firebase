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

  // clear out text boxes on entry
  name = "";
  destination = "";
  frequency = "";
  firstTrain = "";

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

 	      // Log everything that's coming out of snapshot
      console.log("added new child: " + snapshot.val().name);
      console.log(snapshot.val().destination);
      console.log(snapshot.val().frequency);
      console.log(snapshot.val().firstTrain);

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

});
