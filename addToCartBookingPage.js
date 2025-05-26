import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

window.addToCart = function (title, price, location, person, image) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    const cartRef = ref(database, `users/${user.uid}/cart`);
    const newCartItemRef = push(cartRef);

    set(newCartItemRef, {
        title: title,
        price: price,
        location: location,
        person: person,
        image: image,
        quantity: 1,
        totalPrice: price,
        timestamp: Date.now()
    })
    .then(() => {
        alert('Package added to cart!');
    })
    .catch((error) => {
        console.error('Error adding to cart:', error);
        alert('Failed to add package to cart.');
    });
}

