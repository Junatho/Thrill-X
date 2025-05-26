// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, getDoc, collection, onSnapshot, query, where, orderBy, limit, getDocs} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore();

//submit button
const submit = document.getElementById('submit');

submit.addEventListener("click", function (event) {
    event.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    console.log(email, password, username);

    //collection
    const usersCollection = doc(firestore, `users/${email}`);

    const userDocData = {
      email: email,
      password: password,
      username: username,
    };

    addingNewUser(usersCollection, userDocData);

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 

      alert('Account Successfully signed up!')
      location.replace("LoginPage.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
})


async function addingNewUser(usersCollection, userDocData){
  setDoc(usersCollection, userDocData)
  .then(() => {
      console.log('This value has been written to the database');
  })
  .catch((error) => {
      console.log(`I got an error! ${error}`);
  });
}

