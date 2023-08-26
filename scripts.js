document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const descriptionDiv = document.querySelector('.wall-covering-description');

    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove .selected class from other items
            gridItems.forEach(i => i.classList.remove('selected'));

            // Add .selected to the clicked item
            item.classList.add('selected');

            // Update the description based on clicked item
            descriptionDiv.innerHTML = getDescription(item.querySelector('span').textContent.trim());
        });
    });

    // Default to the first item
    gridItems[0].click();
});

function getDescription(type) {
    // Convert the type into lowercase and match with the file name format
    const fileName = type.toLowerCase().replace(/ /g, '_'); // this will convert "Magnetic Dry Erase" to "magnetic_dry_erase"
    
    // Construct the URL to the file
    const fileURL = `artifacts/descriptions/${fileName}.txt`;

    // Fetch the content of the file
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

            // Update the description div with the formatted text
            document.querySelector('.wall-covering-description').innerHTML = formattedText;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
            document.querySelector('.wall-covering-description').innerHTML = 'Description not found.';
        });
}


