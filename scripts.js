document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const descriptionDiv = document.querySelector('.wall-covering-description');

    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            gridItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            getDescription(item.querySelector('span').textContent.trim(), descriptionDiv);
        });
    });

    gridItems[0].click();
});

function craftEmail() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const areaCode = document.getElementById('area-code').value;
    const phone = document.getElementById('phone').value;
    const contactPreference = document.querySelector('input[name="contact-preference"]:checked').value;
    const details = document.getElementById('details').value;

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

    window.location.href = `mailto:dave@keckpaperhanging.com?subject=${subject}&body=${body}`;
}

// Utils
function getDescription(type, targetDiv) {
    const fileName = type.toLowerCase().replace(/ /g, '_');
    const fileURL = `artifacts/wallcovering-type-descriptions/${fileName}.txt`;

    fetch(fileURL)
        .then(response => response.ok ? response.text() : Promise.reject('Network response was not ok'))
        .then(text => {
            const   lines = text.split('\n').filter(line => line.trim() !== '');
            let formattedText;

            const carouselElement = document.querySelector('.wall-coverings.carousel-view');
            if (carouselElement && getComputedStyle(carouselElement).display !== 'none') {
                formattedText = `<h2>${lines[0]}</h2>`;
                if (lines[1]) formattedText += `<p>${lines[1]}</p>`;
            } else {
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

const carouselItems = document.querySelectorAll('.wall-coverings.carousel-view .grid-item');
const indicatorsContainer = document.querySelector('.carousel-indicators');
const carouselView = document.querySelector('.wall-coverings.carousel-view');

let isProgrammaticScroll = false;

// Handlers
let lastSelectedIndex = 0;

function handleDotClick(index) {
    isProgrammaticScroll = true;
    centerAndHighlightItem(index);

    setTimeout(() => {
        isProgrammaticScroll = false;
    }, 500); 

    lastSelectedIndex = index;
}

function handleGridItemClick(index) {
    isProgrammaticScroll = true;
    centerAndHighlightItem(index);

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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.custom-carousel .item');

    items.forEach(function(item) {
        item.addEventListener('click', function() {
            const carousel = item.parentElement;
            const scrollLeft = item.offsetLeft - (carousel.offsetWidth / 2) + (item.offsetWidth / 2);
            carousel.scroll({
                top: 0,
                left: scrollLeft,
                behavior: 'smooth'
            });
        });
    });
});
  