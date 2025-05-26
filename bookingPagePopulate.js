import activities from "./activitiesData.js";

function getActivityById(id) {

    const activity = activities.find(activity => activity.id === id);
    console.log('Matched activity:', activity);
    return activity;

}

// Extract activity ID from URL
const params = new URLSearchParams(window.location.search);
const activityId = params.get('id');
console.log('Full query string:', window.location.search);
console.log('Extracted activityId:', activityId);

const activity = getActivityById(activityId);
console.log(activity);

if (activity) {
    document.getElementById('activityTitle').textContent = activity.name;
    document.getElementById('activityImage').src = activity.image;
    document.getElementById('activityDescription').textContent = activity.description;
    document.getElementById('startFromPrice').textContent = `Rp ${activity.price}`;
    document.getElementById('sidePhoto1').src = activity.image2;
    document.getElementById('sidePhoto2').src = activity.image3;
    document.getElementById('locationGMAPS').src = activity.locationGMAPS;

    const locationField = document.getElementById("locationField");
    const locationFieldcontent = document.createTextNode(`${activity.location}`);
    locationField.appendChild(locationFieldcontent);

    const openHoursFieldDiv = document.getElementById("openHoursField");
    const content = document.createTextNode(`${activity.openHours}`);
    openHoursFieldDiv.appendChild(content);

    // Populate packages
    const packageContainer = document.getElementById('packageContainer');
    activity.details.packages.forEach(pkg => {
        const packageElement = document.createElement('div');
        packageElement.innerHTML = `
            <!-- First Package: Highlights -->
                <div class="bg-black text-white rounded-xl shadow-md">
                    <!-- Package Content -->
                    <div class="flex flex-col p-6 space-y-2 flex-grow">
                        <!-- Package Title -->
                        <p class="font-semibold font-roboto-mono text-white text-2xl">${pkg.title}</p>
                        
                        <!-- Highlight Tags -->
                        <div class="flex gap-2">
                            <div class="bg-white text-black py-1 px-3 border border-black rounded-lg font-medium text-sm">
                                Free Cancellation (24 hours notice)
                            </div>
                            <div class="bg-white text-black py-1 px-3 border border-black rounded-lg font-medium text-sm">
                                Instant Confirmation
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Section: Price Info and Action Buttons -->
                    <div class="bg-[#3D3D3D] p-6 pb-2 pt-2 mb-10 flex items-center justify-between rounded-b-xl">
                        <!-- Pricing Text -->
                        <div class="flex flex-col">
                            <p class="text-sm text-white font-roboto-mono font-bold">Total Price</p>
                            <p class="text-2xl font-roboto-mono font-bold text-white">Rp ${pkg.price.toLocaleString()}</p>
                            <p class="text-sm text-[#b3b3b3]">All fees and taxes included</p>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex space-x-4 ml-auto">
                            <!-- Add to Cart Button -->
                            <a>
                                <button class="bg-[#818181] font-medium text-black px-4 py-2 rounded-3xl hover:bg-gray-400" onclick="addToCart('${pkg.title}', ${pkg.price}, '${pkg.location}', ${pkg.person}, '${pkg.image}')">
                                    Add to Cart
                                </button>
                            </a>
                            
                            <!-- Book Now Button -->
                            <a href="PaymentPage.html">
                                <button class="bg-[#730008] text-white px-4 py-2 rounded-3xl hover:bg-[#9A040F]">
                                    Book Now
                                </button>
                            </a>
                        </div>
                    </div> <!-- End of bottom section -->
                </div> <!-- End of first package highlights -->
        `;
        packageContainer.appendChild(packageElement);
    });

    // Populate highlights
    const highlightsContainer = document.getElementById('highlightsContainer');
    activity.details.highlights.forEach(highlight => {
        const highlightElement = document.createElement('li');
        highlightElement.textContent = highlight;
        highlightsContainer.appendChild(highlightElement);
    });

    // Populate activity info
    const activityInfoContainer = document.getElementById('activityInfoContainer');
    activity.details.activityInfo.forEach(info => {
        activityInfoContainer.insertAdjacentHTML('beforeend', `
            <div class="col-span-3 border-b-2 border-gray-300 pb-4 flex">
                <div class="w-1/3 font-semibold pr-4 font-roboto-mono tracking-wider">${info.title}</div>
                <div class="w-2/3 font-roboto">
                    ${Array.isArray(info.description) ? info.description.join('<br>') : info.description}
                </div>
            </div>
        `);
    });

    // Populate risks
    const risksContainer = document.getElementById('risksContainer');
    activity.details.risks.forEach(risk => {
        const riskElement = document.createElement('div');
        riskElement.innerHTML = `
            <div class="flex items-start space-x-8">
                <span class="text-xl">
                    <i class="fa-solid fa-xmark fa-lg"></i>
                </span>
                <p>${risk}</p>
            </div>
        `;
        risksContainer.appendChild(riskElement);
    });

    // Populate FAQ
    const faqContainer = document.getElementById('faqContainer');
    activity.details.faq.forEach(faq => {
        const faqElement = document.createElement('div');
        faqElement.innerHTML = `
            <div class="bg-[#212121] text-white text-xl rounded-lg p-8 hover:bg-[#0f0f0f] transition duration-200">
                <div class="flex justify-between items-center">
                <!-- Question Area -->
                <div class="w-10/12">
                    <span>${faq.question}</span>
                </div>
                <!-- Button Area -->
                <div class="w-2/12 flex justify-end">
                    <button class="w-10 h-10 bg-black text-red-500 rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-200" onclick="${faq.togglefaq}">
                    <span id="${faq.id}">+</span>
                    </button>
                </div>
                </div>
                <div id="${faq.id2}" class="faq-answer hidden">
                <p class="text-[#b3b3b3] mt-4">${faq.answer}</p>    
                </div>
            </div>
        `;
        faqContainer.appendChild(faqElement);
    });

    // Populate hotels nearby
    const hotelsNearbyElement = document.getElementById('hotelsNearbyElement');
    activity.details.hotelsNearby.forEach(hotelsNearby => {
        const hotelsNearbyElementLi = document.createElement('li');
        hotelsNearbyElementLi.textContent = hotelsNearby;
        hotelsNearbyElementLi.className = 'hover:text-gray-300';
        hotelsNearbyElement.appendChild(hotelsNearbyElementLi);
    });

    // Populate how to get there
    const howToGetThereElement = document.getElementById('howToGetThereElement');
    activity.details.howToGetThere.forEach(howToGetThere => {
        const howToGetThereElementLi = document.createElement('li');
        howToGetThereElementLi.textContent = howToGetThere;
        howToGetThereElementLi.className = 'hover:text-gray-300';
        howToGetThereElement.appendChild(howToGetThereElementLi);
    });

    // Populate hotels nearby
    const whatYouNeedElement = document.getElementById('whatYouNeedElement');
    activity.details.whatYouNeed.forEach(whatYouNeed => {
        const whatYouNeedElementLi = document.createElement('li');
        whatYouNeedElementLi.textContent = whatYouNeed;
        whatYouNeedElementLi.className = 'hover:text-gray-300';
        whatYouNeedElement.appendChild(whatYouNeedElementLi);
    });

} else {
    console.error('Activity not found!');
}
