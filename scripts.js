document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const descriptionDiv = document.querySelector('.wall-covering-description');

    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove .selected class from other items
            gridItems.forEach(i => i.classList.remove('selected'));

            // Add .selected to the clicked item
            item.classList.add('selected');

            // Fetch and update the description based on clicked item
            getDescription(item.querySelector('span').textContent.trim(), descriptionDiv);
        });
    });

    // Default to the first item
    gridItems[0].click();
});

function craftEmail() {
    // Get values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const areaCode = document.getElementById('area-code').value;
    const phone = document.getElementById('phone').value;
    const contactPreference = document.querySelector('input[name="contact-preference"]:checked').value;
    const details = document.getElementById('details').value;

    // Create email subject and body
    const subject = encodeURIComponent(`${firstName} ${lastName}'s Request for Wallpaper Consultation`);
    const body = encodeURIComponent(
        `Contact: \n` +
        `${firstName} ${lastName}\n` +
        `${email}\n` +
        `${areaCode} - ${phone}\n` +
        `Preferred contact: ${contactPreference}\n\n` +
        `Details:\n` +
        `${details}`
    );

    // Open email client
    window.location.href = `mailto:dave@keckpaperhanging.com?subject=${subject}&body=${body}`;
}

// Utils
function getDescription(type, targetDiv) {
    const fileName = type.toLowerCase().replace(/ /g, '_');
    const fileURL = `artifacts/descriptions/${fileName}.txt`;

    fetch(fileURL)
        .then(response => response.ok ? response.text() : Promise.reject('Network response was not ok'))
        .then(text => {
            const lines = text.split('\n').filter(line => line.trim() !== '');
            let formattedText;

            // Check if it's the carousel view by the display property of the element
            const carouselElement = document.querySelector('.wall-coverings.carousel-view');
            if (carouselElement && getComputedStyle(carouselElement).display !== 'none') {
                // Carousel view: Display only the first h2 and the first p
                formattedText = `<h2>${lines[0]}</h2>`; // Assuming the first line is always h2
                if (lines[1]) formattedText += `<p>${lines[1]}</p>`; // Append the first p if it exists
            } else {
                // Not carousel view: Display everything
                formattedText = lines.map((line, index) => 
                    index === 0 ? `<h2>${line}</h2>` : `<p>${line}</p>`
                ).join('');
            }

            targetDiv.innerHTML = formattedText;
        })
        .catch(error => {
            console.log('Fetch operation error:', error);
            targetDiv.innerHTML = 'Description not found.';
        });
}

// DOM elements
const carouselItems = document.querySelectorAll('.wall-coverings.carousel-view .grid-item');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const carouselView = document.querySelector('.wall-coverings.carousel-view');

let isProgrammaticScroll = false; // New flag

// Handlers
let lastSelectedIndex = 0;

function handleDotClick(index) {
    isProgrammaticScroll = true;  // Set the flag
    centerAndHighlightItem(index);
    
    // After a delay, reset the flag
    setTimeout(() => {
        isProgrammaticScroll = false;
    }, 500); 

    lastSelectedIndex = index;
}

function handleGridItemClick(index) {
    isProgrammaticScroll = true;  // Set the flag
    centerAndHighlightItem(index);
    
    // After a delay, reset the flag
    setTimeout(() => {
        isProgrammaticScroll = false;
    }, 500);

    lastSelectedIndex = index;
}

// Utility to center and highlight the selected item
function centerAndHighlightItem(index) {
    carouselItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    carouselItems.forEach(item => item.classList.remove('selected'));
    carouselItems[index].classList.add('selected');
    updateActiveDot(index);
    updateDescriptionBasedOnType(index);
}

// Utilities for Carousel behaviors
function updateActiveDot(index) {
    document.querySelectorAll('.carousel-indicators .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function getTypeFromGridItem(index) {
    const span = carouselItems[index].querySelector('span');
    return span ? span.textContent : null;
}

function updateDescriptionBasedOnType(index) {
    const type = getTypeFromGridItem(index);
    if (type) {
        const targetDiv = document.querySelector('.wall-covering-description');
        getDescription(type, targetDiv);
    }
}

// Event bindings
carouselItems.forEach((item, index) => {
    item.addEventListener('click', () => handleGridItemClick(index));
});

for (let i = 0; i < carouselItems.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => handleDotClick(i));
    indicatorsContainer.appendChild(dot);
}

// Initial setup
updateDescriptionBasedOnType(0);
