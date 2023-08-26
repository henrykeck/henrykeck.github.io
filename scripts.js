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

document.getElementById("quote-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const email = document.querySelector("#email").value;
    const phone = document.querySelector("#phone").value;
    const installationType = document.querySelector("#installation-type").value;
    const message = document.querySelector("#message").value;

    const subject = `New Quote Request from ${firstName} ${lastName}`;
    const body = `
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone Number: ${phone}
Installation Type: ${installationType}
Message: ${message}
    `;

    window.location.href = `mailto:henry@keckpaperhanging.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

