// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, getDoc, collection, onSnapshot, query, where, orderBy, limit, getDocs} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore();

//logout button
const LogOut = document.getElementById('LogOutButton');

LogOut.addEventListener("click", function (event) {
    event.preventDefault()
    
    auth.signOut().then(() => {
      alert('Account Successfully Log Out!')
      window.location.replace("index.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
})

auth.onAuthStateChanged( user => {
    if(user != null) {
        console.log('logged in!');

        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const uid = user.uid;
        const userToken = user.getToken;

        readUserDocument(email);

        console.log(`name: ${displayName}`);
        console.log(`email: ${email}`);

    } else {
        console.log('No user');
    }
});




async function readUserDocument(email) {
  const userDocument = doc(firestore,  `users/${email}`);
  const mySnapshot = await getDoc(userDocument);
  if(mySnapshot.exists()) {
      const docData = mySnapshot.data();
      const docDataJSON = JSON.stringify(docData);
      let jsonArrayData = [docData];
      const username = jsonArrayData[0]["username"];
      console.log(`My data is ${docDataJSON}`);
      console.log(`My username is ${username}`);
      userAuthProfile(username);
      updateAccountInfo(email, username);
      // usernameQuery();
  }
}

function userAuthProfile(username) {
  updateProfile(auth.currentUser, {
    displayName: username
  }).then(() => {
    // Profile updated!
    console.log('Profile updated!')
    // ...
  }).catch((error) => {
    // An error occurred
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });
}

function updateAccountInfo(email, username) {
  // Find the elements by their class names and update the content
  document.querySelector('.USERNAME').textContent = username;
  document.querySelector('.EMAIL').textContent = email;
}

function usernameQuery() {
  const usernameQuery = query(
    collection(firestore, 'users'),
    where('username'),
    // orderBy('price'),
    // limit(10),
  );
  console.log(`username: ${usernameQuery}`)
}