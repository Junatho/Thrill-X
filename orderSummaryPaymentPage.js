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
                const orderSummaryPopulate = document.getElementById('orderSummaryPopulate');
                orderSummaryPopulate.innerHTML = '';

                const taxElement = document.getElementById('taxField');
                const subtotalElement = document.getElementById('subTotalField');
                const totalElement = document.getElementById('totalField');

                let subtotal = 0;

                if (snapshot.exists()) {
                    const cartData = snapshot.val();

                    Object.keys(cartData).forEach((key) => {
                        const cartItem = cartData[key];

                        // Calculate subtotal
                        subtotal += cartItem.totalPrice || cartItem.price * (cartItem.quantity || 1);

                        const itemHTML = `
                            <div class="flex items-start space-x-4 py-4">
                                <img src="${cartItem.image}" alt="${cartItem.title}" class="w-20 h-20 object-cover rounded">
                                <div>
                                    <h3 class="font-roboto-mono text-lg font-bold">${cartItem.title}</h3>
                                </div>
                                <h3 class="font-semibold text-lg text-right w-full">Rp ${cartItem.totalPrice.toLocaleString()}</h3>
                            </div>
                            <p class="text-black text-sm">
                                <i class="fa fa-location-dot mr-1"></i>${cartItem.location}
                            </p>
                            <p class="text-red-700 text-sm flex items-center">
                                <i class="fa fa-user mr-1"></i> ${cartItem.person} Person(s)
                            </p>
                            <!-- <p class="text-red-700 text-sm flex items-center">
                                <i class="fa fa-clock mr-1"></i> 15:00 WIB
                            </p>
                            <p class="text-red-700 text-sm flex items-center">
                                <i class="fa fa-calendar-alt mr-1"></i> Thu, 04 Dec 2022
                            </p> -->

                            <hr class="my-4">
                        `;

                        orderSummaryPopulate.insertAdjacentHTML('beforeend', itemHTML);
                    });

                    // Update tax, subtotal, and total
                    const tax = subtotal * 0.10; // 10% tax
                    const total = subtotal + tax;

                    taxElement.textContent = `Rp ${tax.toLocaleString()}`;
                    subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
                    totalElement.textContent = `Rp ${total.toLocaleString()}`;
                } else {
                    orderSummaryPopulate.innerHTML = '<p>No items in cart.</p>';
                    taxElement.textContent = 'Rp 0';
                    subtotalElement.textContent = 'Rp 0';
                    totalElement.textContent = 'Rp 0';
                }
            });
        } else {
            // User is not logged in
            alert("You must be logged in to proceed.");
        }
    });
}

document.addEventListener('DOMContentLoaded', loadCartItems);




document.querySelector('button[type="submit"]').addEventListener('click', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to place an order.");
        return;
    }

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName || !lastName || !phoneNumber || !email) {
        alert("Please fill in all contact information fields.");
        return;
    }

    // Get selected items from cart
    const cartRef = ref(database, `users/${user.uid}/cart`);
    const cartSnapshot = await get(cartRef);

    if (!cartSnapshot.exists()) {
        alert("Your cart is empty.");
        return;
    }

    const cartData = cartSnapshot.val();
    const orderItems = Object.keys(cartData).map((key) => ({
        ...cartData[key],
        itemId: key,
    }));

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const orderData = {
        contactInfo: {
            firstName,
            lastName,
            phoneNumber,
            email,
        },
        orderSummary: {
            items: orderItems,
            subtotal,
            tax,
            total,
        },
        orderDate: new Date().toISOString(),
    };

    const ordersRef = ref(database, `users/${user.uid}/orders`);
    const newOrderRef = push(ordersRef);

    try {
        await set(newOrderRef, orderData);
        await remove(cartRef);
        alert("Your order has been placed successfully!");

        window.location.href = "LandingPage.html";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('pay-button');

    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');
    const phoneNumberField = document.getElementById('phone-number');
    const emailField = document.getElementById('email');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');

    function validateForm() {
        const isFirstNameValid = firstNameField.value.trim() !== '';
        const isLastNameValid = lastNameField.value.trim() !== '';
        const isPhoneNumberValid = phoneNumberField.value.trim() !== '';
        const isEmailValid = emailField.value.trim() !== '';
        const isPaymentMethodSelected = Array.from(paymentMethods).some(method => method.checked);

        // Enable button only if all fields are valid
        const isFormValid = isFirstNameValid && isLastNameValid && isPhoneNumberValid && isEmailValid && isPaymentMethodSelected;

        payButton.disabled = !isFormValid; // Disable button if the form is invalid
    }

    firstNameField.addEventListener('input', validateForm);
    lastNameField.addEventListener('input', validateForm);
    phoneNumberField.addEventListener('input', validateForm);
    emailField.addEventListener('input', validateForm);
    paymentMethods.forEach(method => method.addEventListener('change', validateForm));

    validateForm();
});

