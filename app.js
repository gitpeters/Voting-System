
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDXCTCZDdniKGB_pOi48AzcvVqLSVIogUI",
    authDomain: "vote-de1fa.firebaseapp.com",
    databaseURL: "https://vote-de1fa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vote-de1fa",
    storageBucket: "vote-de1fa.appspot.com",
    messagingSenderId: "79181243520",
    appId: "1:79181243520:web:4e193e63c5b015ee95f265",
    measurementId: "G-NSJ079FN47"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const database = firebase.database();

const names = ['Abraham', 'Israel', 'Chidi', 'Solomon', 'Abosede', 'Evelyn', 'Pedro', 'Reuben', 'Gaius', 'Ebube', 'Emmanuel', 'Ameenat'];

const numberToName = {
    1: 'Abraham',
    2: 'Israel',
    3: 'Chidi',
    4: 'Solomon',
    5: 'Abosede',
    6: 'Evelyn',
    7: 'Pedro',
    8: 'Reuben',
    9: 'Gaius',
    10: 'Ebube',
    11: 'Emmanuel',
    12: 'Ameenat'
};

let numbers = [];

function generateNumbersList() {
    while (numbers.length < 12) {
      const randomNum = Math.floor(Math.random() * 100) + 1;
      if (numbers.indexOf(randomNum) === -1) {
        numbers.push(randomNum);
      }
    }
  
    const numbersList = document.getElementById("numbers-list");
    numbersList.innerHTML = "";
    numbers.forEach((num) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "number";
      input.value = num;
  
      // Assign a name to the number
      const randomIndex = Math.floor(Math.random() * names.length);
      const name = names[randomIndex];
      numberToName[num] = name;
      console.log(numberToName[num]);
  
      label.appendChild(input);
      label.appendChild(document.createTextNode(num));
      li.appendChild(label);
      numbersList.appendChild(li);
    });
  }
  
  let isFormSubmitted = false;
  
  function submitForm(event) {
    event.preventDefault();

    if (isFormSubmitted) {
        alert("You have submitted the form already.");
        return;
    }
    isFormSubmitted = true;

    const name = document.getElementById("name").value.trim();
    const selectedNumber = document.querySelector('input[name="number"]:checked');
    if (selectedNumber === null) {
      alert("Please select a number.");
      return;
    }
    const number = parseInt(selectedNumber.value);
  
    if (!names.includes(name)) {
      alert("Your name is not on the list.");
      return;
    }


  
    const assignedName = numberToName[number];
    
  
    if (assignedName === undefined) {
      alert("This number is not assigned to any name.");
      return;
    }
  
    if (assignedName === name) {
      alert("You cannot select a number that matches your name.");
      return;
    }
  
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const p = document.createElement("p");
    p.innerHTML = `Thank you, ${name}! You have selected number ${number}. You picked ${assignedName}.`;
    resultDiv.appendChild(p);

    // Remove the assigned name from the available names list
    const nameIndex = names.indexOf(assignedName);
    if (nameIndex > -1) {
      names.splice(nameIndex, 1);
    }
    // Update the numbersList HTML element
    const numbersList = document.getElementById("numbers-list");
    numbersList.innerHTML = "";
    numbers.forEach((num) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "number";
      input.value = num;
  
      const assignedName = numberToName[num];
  
      label.appendChild(input);
      label.appendChild(document.createTextNode(`${num}`));
      li.appendChild(label);
      numbersList.appendChild(li);
    });

    // Save the record to Firebase Realtime Database
    const recordRef = database.ref("records").push();
    recordRef.set({
      voter_name: name,
      assigned_name: assignedName
    });
  }

  

  // Retrieve the voting records from Firebase Realtime Database
  database.ref("records").once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      const record = childSnapshot.val();
      console.log(record);
    });
  });

generateNumbersList();
const form = document.getElementById('number-form');
form.addEventListener('submit', submitForm);

