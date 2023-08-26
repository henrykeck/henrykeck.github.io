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
    switch(type) {
        case 'Residential': 
            return 'Residential wallpapers offer a wide range of designs and textures suitable for home environments. They add warmth and character to any living space.';
        
        case 'Commercial': 
            return 'Commercial wallpapers are designed for high traffic areas and meet stringent safety and durability standards. They are ideal for businesses and offices.';
        
        case 'Fabric': 
            return 'Fabric wallpapers provide a luxurious and tactile finish to walls, adding a touch of sophistication to any room.';
        
        case 'Murals': 
            return 'Murals are large-scale artworks or photographs that can turn any wall into a stunning focal point. It adds a unique touch to spaces.';
        
        case 'Sisal': 
            return 'Sisal wallpapers are made from natural fibers, giving a rustic and organic texture to walls.';
        
        case 'Magnetic Dry Erase': 
            return 'Magnetic Dry Erase wallpapers are perfect for offices and study rooms, allowing you to write and erase, while also sticking on magnetic objects.';
        
        case 'Wood Veneers': 
            return 'Wood Veneer wallpapers mimic the appearance of wood, providing warmth and elegance without using actual wood planks.';
        
        case 'Sound Paneling': 
            return 'Sound Paneling wallpapers help reduce noise transmission, perfect for home theaters, studios, or any room where acoustic control is desired.';
        
        case 'Foils': 
            return 'Foils wallpapers have a metallic sheen, adding a modern and glitzy touch to spaces. They reflect light and can make a space feel larger.';
        
        default: 
            return '';
    }
}
