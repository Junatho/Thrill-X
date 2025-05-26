import activities from "./activitiesData.js";

document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('locationInput');
    const numberGuestInput = document.getElementById('numberGuestInput');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const activityContainer = document.getElementById('activityContainer');
    const waterButton = document.getElementById('waterButton');
    const airButton = document.getElementById('airButton');
    const landButton = document.getElementById('landButton');
    const fireButton = document.getElementById('fireButton');
    let sortOrder = 'default';
    let selectedCategory = null;

    
    // Function to filter and sort activities
    function filterActivities() {
        const locationValue = locationInput.value.toLowerCase();
        const guestsValue = parseInt(numberGuestInput.value, 10);
        const searchValue = searchInput.value.toLowerCase();

        // Filter activities based on input criteria and selected category
        let filteredActivities = activities.filter(activity => {
            return (
                (!locationValue || activity.location.toLowerCase().includes(locationValue)) &&
                (!guestsValue || activity.guestsAllowed >= guestsValue) &&
                (!searchValue || activity.name.toLowerCase().includes(searchValue)) &&
                (!selectedCategory || activity.category === selectedCategory)
            );
        });

        if (sortOrder === 'price-highest') {
            filteredActivities.sort((a, b) => b.priceForFilter - a.priceForFilter);
        } else if (sortOrder === 'price-lowest') {
            filteredActivities.sort((a, b) => a.priceForFilter - b.priceForFilter);
        }

        // Clear existing activities in the container
        activityContainer.innerHTML = '';

        // Populate the container with the filtered and sorted activities
        filteredActivities.forEach(activity => {
            const activityCard = `
                <a href="BookingPage.html?id=${activity.id}" class="activity-card block bg-white p-4 rounded-lg shadow group transition duration-300 transform hover:bg-gray-200">
                    <img src="${activity.image}" alt="${activity.name}" class="rounded-lg mb-4 h-60 w-full object-cover">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-xl font-roboto-mono font-bold text-[#000000]">${activity.location}</h3>
                        <p class="text-[#000000] text-lg font-bold">${activity.rating}</p>
                    </div>
                    <h3 class="text-2xl font-roboto-mono font-bold text-[#000000]">${activity.name}</h3>
                    <p class="text-lg font-roboto-mono font-bold text-[#000000] mt-1">From Rp ${activity.price.toLocaleString()}</p>
                </a>
            `;
            activityContainer.innerHTML += activityCard;
        });
    }

    // Event listeners to sort options
    dropdownMenu.querySelectorAll('a').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            sortOrder = option.getAttribute('data-value');
            filterActivities();
            dropdownMenu.classList.add('hidden'); 
        });
    });

    // Event listeners for category
    waterButton.addEventListener('click', () => {
        selectedCategory = 'water';
        filterActivities();
    });

    airButton.addEventListener('click', () => {
        selectedCategory = 'air';
        filterActivities();
    });

    landButton.addEventListener('click', () => {
        selectedCategory = 'land';
        filterActivities();
    });

    fireButton.addEventListener('click', () => {
        selectedCategory = 'fire';
        filterActivities();
    });

    locationInput.addEventListener('input', filterActivities);
    numberGuestInput.addEventListener('input', filterActivities);
    searchInput.addEventListener('input', filterActivities);
    searchButton.addEventListener('click', filterActivities);
});
