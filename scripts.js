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

function getDescription(type, targetDiv) {
    const fileName = type.toLowerCase().replace(/ /g, '_');
    const fileURL = `artifacts/descriptions/${fileName}.txt`;

    fetch(fileURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            // Split the content by line
            const lines = text.split('\n').filter(line => line.trim() !== '');

            // Format the text
            const formattedText = lines.map((line, index) => {
                if (index === 0) {
                    return `<h2>${line}</h2>`;
                } else {
                    return `<p>${line}</p>`;
                }
            }).join('');

            // Update the target div with the formatted text
            targetDiv.innerHTML = formattedText;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
            targetDiv.innerHTML = 'Description not found.';
        });
}

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

// Get carousel items and indicators container
var carouselItems = document.querySelectorAll('.wall-coverings.carousel-view .grid-item');
var indicatorsContainer = document.querySelector('.carousel-indicators');

// Generate dots
for (let i = 0; i < carouselItems.length; i++) {
    let dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', function() {
        // Scroll the carousel to the clicked dot's corresponding item
        carouselItems[i].scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    });
    indicatorsContainer.appendChild(dot);
}

// Check which carousel item is in view and update dots
document.querySelector('.wall-coverings.carousel-view').addEventListener('scroll', function() {
    let maxVisibleIndex = 0;
    let maxVisiblePercentage = 0;

    carouselItems.forEach((item, index) => {
        let rect = item.getBoundingClientRect();
        let width = rect.width;
        let visibleWidth = Math.min(window.innerWidth - rect.left, width);
        let visiblePercentage = visibleWidth / width;

        if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage;
            maxVisibleIndex = index;
        }
    });

    document.querySelectorAll('.carousel-indicators .dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === maxVisibleIndex);
    });
});
