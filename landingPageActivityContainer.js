import activities from './activitiesData.js';

const activityContainer = document.getElementById('activityContainer');

activities.forEach(activity => {
    const activityElement = document.createElement('a');
    activityElement.href = `BookingPage.html?id=${activity.id}`;
    activityElement.id = activity.id;
    activityElement.dataset.value = activity.id;
    activityElement.className = 'activity-card block bg-white p-4 rounded-lg shadow group transition duration-300 transform hover:bg-gray-200';
    activityElement.innerHTML = `
        <img src="${activity.image}" alt="${activity.name}" class="rounded-lg mb-4 h-60 w-full object-cover">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-xl font-roboto-mono font-bold text-[#000000]">${activity.location}</h3>
			<p class="text-[#000000] text-lg font-bold">${activity.rating}</p>
		</div>
		<h3 class="text-2xl font-roboto-mono font-bold text-[#000000]">${activity.name}</h3>
		<p class="text-lg font-roboto-mono font-bold text-[#000000] mt-1">From Rp ${activity.price.toLocaleString()}</p>
    `;
    activityContainer.appendChild(activityElement);
});
