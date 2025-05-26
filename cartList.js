import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, update, get, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


function loadCartItems() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            const cartRef = ref(database, `users/${user.uid}/cart`);

            onValue(cartRef, (snapshot) => {
                const cartListItem = document.getElementById('cartListItem');
                cartListItem.innerHTML = '';

                if (snapshot.exists()) {
                    const cartData = snapshot.val();
                    let subtotal = 0;
                    Object.keys(cartData).forEach((key) => {
                        const cartItem = cartData[key];
                        
                        subtotal += (cartItem.totalPrice);
                        

                        const itemHTML = `
                            <div class="flex items-center space-x-4 py-4 border-b">
                                <div class="flex items-start w-3/5 space-x-4">

                                    <!-- <input type="checkbox" id="checkbox-item1" name="activityCheckBox" class="cart-item-checkbox mt-2 text-[#A61E28]" data-key="item${key}" data-price="${cartItem.totalPrice}" data-quantity="${cartItem.quantity}" onclick="updateTotals()" id="radio-item1"> -->
                                    
                                    <img src="${cartItem.image}" alt="${cartItem.title}" class="w-20 h-20 object-cover rounded">
                                    <div>
                                        <h3 class="font-roboto-mono text-g">${cartItem.title}</h3>
                                        <p class="text-gray-500 text-sm">${cartItem.location}</p>
                                        <p class="text-red-700 text-sm flex items-center">
                                            <i class="fa fa-user mr-1"></i> ${cartItem.person} Person(s)
                                        </p>
                                        <!-- <p class="text-red-700 text-sm flex items-center">
                                            <i class="fa fa-calendar-alt mr-1"></i> Thu, 04 Dec 2022
                                        </p> -->
                                    </div>
                                </div>
            
                                <div class="flex items-center w-2/5 justify-around space-x-4">
                                    <span class="w-2/3 text-left">Rp ${cartItem.price.toLocaleString()}</span>
                                    <div class="flex items-center space-x-2 w-1/3">
                                        <button class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onclick="changeQuantity('${key}', -1, ${cartItem.price})">-</button>
                                        <span id="qty-${key}">${cartItem.quantity}</span>
                                        <button class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onclick="changeQuantity('${key}', 1, ${cartItem.price})">+</button>
                                    </div>
                                    <span class="w-2/3 text-left font-bold" id="total-${key}">Rp ${cartItem.totalPrice.toLocaleString()}</span>
                                </div>
                                <button class="text-red-600 hover:text-red-800" onclick="removeFromCart('${key}')"">
                                    <i class="fa fa-trash-alt"></i>
                                </button>
                            </div>
                        `;

                        cartListItem.insertAdjacentHTML('beforeend', itemHTML);
                    });

                    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
                    document.getElementById('total').textContent = `Rp ${((subtotal * 0.10) + subtotal).toLocaleString()}`;

                } else {
                    cartListItem.innerHTML = '<p>No items in cart.</p>';
                }
            });
        } else {
            // User is not logged in
            alert("You must be logged in to view items in the cart.");
        }
    });
}


window.removeFromCart = function (itemId) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to remove items from the cart.");
        return;
    }

    // Reference to the cart item in Firebase
    const cartItemRef = ref(database, `users/${user.uid}/cart/${itemId}`);

    remove(cartItemRef)
        .then(() => {
            alert('Item removed from cart!');
            loadCartItems();
        })
        .catch((error) => {
            console.error('Error removing item:', error);
            alert('Failed to remove item.');
        });
};


window.changeQuantity = function(key, change, price) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to modify cart items.");
        return;
    }

    // Get the reference for the cart item
    const cartItemRef = ref(database, `users/${user.uid}/cart/${key}`);

    // Fetch the current quantity from Firebase
    get(cartItemRef).then((snapshot) => {
        if (snapshot.exists()) {
            let currentQuantity = snapshot.val().quantity || 1;
            currentQuantity += change; 

            if (currentQuantity < 1) {
                currentQuantity = 1;
            }
            
            // Update the quantity
            update(cartItemRef, { quantity: currentQuantity })
                .then(() => {
                    const quantityElement = document.getElementById(`qty-${key}`);
                    quantityElement.textContent = currentQuantity;

                    // Update the total price
                    const totalElement = document.getElementById(`total-${key}`);
                    const newTotal = currentQuantity * price;
                    totalElement.textContent = `Rp ${newTotal.toLocaleString()}`;

                    update(cartItemRef, { totalPrice: newTotal });
                })
                .catch((error) => {
                    console.error('Error updating quantity in Firebase:', error);
                });
        } else {
            console.error('Cart item does not exist in Firebase.');
        }
    }).catch((error) => {
        console.error('Error retrieving cart item from Firebase:', error);
    });
};

document.addEventListener('DOMContentLoaded', loadCartItems);


window.updateTotals = function () {
    // Select all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="activityCheckBox"]');

    let subtotal = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const price = parseInt(checkbox.getAttribute('data-price'), 10);
            subtotal += price;
        }
    });

    // Calculate the total with VAT (e.g., 10% VAT)
    const vatRate = 0.10;
    const total = subtotal + subtotal * vatRate;

    // Update the subtotal and total elements
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `Rp ${total.toLocaleString()}`;
}

