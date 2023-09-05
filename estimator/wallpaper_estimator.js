class Material {
    constructor(name, width, verticalRepeat = 0.0) {
        this.name = name;
        this.width = width;
        this.verticalRepeat = verticalRepeat;
    }
}

class Wall {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
}

class Room {
    constructor() {
        this.walls = [];
    }

    addWall(height, width) {
        let wall = new Wall(height, width);
        this.walls.push(wall);
        return wall;
    }
}

function generateBasicRoom(height, wallsWidths) {
    let room = new Room();
    
    for (let width of wallsWidths) {
        room.addWall(height, width);
    }
    
    return room;
}

function convertToInches(value, unit) {
    switch(unit) {
        case "inches":
            return value;
        case "feet":
            return value * 12;
        case "yards":
            return value * 36; 
        case "centimeters":
            return value * 0.393701; // 1 cm is approx 0.393701 inches
        case "meters":
            return value * 39.3701; // 1 meter is approx 39.3701 inches
        default:
            return value; // default to returning the input value if unit is unknown
    }
}

function estimateLinearFeetForWall(wall, material) {
    const widthsNeeded = Math.ceil(wall.width / material.width);
    let totalInches = 0;

    const inchesInRepeat = material.verticalRepeat;

    for (let i = 0; i < widthsNeeded; i++) {
        let adjustedHeight = wall.height;
        if (inchesInRepeat !== 0) {
            adjustedHeight = Math.ceil(adjustedHeight / inchesInRepeat) * inchesInRepeat;
        }
        totalInches += adjustedHeight;
    }

    return totalInches / 12; // convert inches to feet
}

function estimateMaterialForRoom(room, material) {
    let totalLinearFeet = 0;
    for (let wall of room.walls) {
        totalLinearFeet += estimateLinearFeetForWall(wall, material);
    }
    return 1.1 * totalLinearFeet; // build in 10% for good measure
}

let wallCount = 1;

document.getElementById('addWall').addEventListener('click', function() {
    wallCount++;

    if (wallCount > 4) {
        alert("You've reached the maximum number of walls!");
        addButton.disabled = true;
        return;
    }

    const wallInputs = document.createElement('div');
    wallInputs.classList.add('wall');
    
    wallInputs.innerHTML = `
        <p>Wall ${wallCount}:</p>
        <div class="wall-inputs">
            <label for="wall${wallCount}Width">Width</label>
            <input type="number" id="wall${wallCount}Width">

            <label for="wall${wallCount}Height">Height</label>
            <input type="number" id="wall${wallCount}Height">

            <label for="units">Units</label>
            <select class="measurement" id="wall-units">
                <option value="inches">in</option>
                <option value="feet">ft</option>
                <option value="yards">yds</option>
                <option value="centimeters">cm</option>
                <option value="meters">m</option>
            </select>
        </div>
    `;

    document.getElementById('wall-container').appendChild(wallInputs);

    if (wallCount == 4) {
        const addButton = document.getElementById('addWall');
        addButton.textContent = "Max Walls";
        return;
    }
});

document.getElementById('finishWalls').addEventListener('click', function() {
    document.getElementById('room-modeling').style.display = 'none';
    document.getElementById('material-input').style.display = 'block';
});

document.getElementById('calculate').addEventListener('click', function() {
    const room = new Room();

    for (let i = 1; i <= wallCount; i++) {
        let wallWidth = parseFloat(document.getElementById(`wall${i}Width`).value);
        let wallHeight = parseFloat(document.getElementById(`wall${i}Height`).value);
        
        let unit = document.getElementById('wall-units').value; 
        wallWidth = convertToInches(wallWidth, unit);
        wallHeight = convertToInches(wallHeight, unit);

        room.addWall(wallHeight, wallWidth);
    }

    const materialWidthRaw = parseFloat(document.getElementById('materialWidth').value);
    const patternUnit = document.getElementById('pattern-units').value; 
    const materialWidthInInches = convertToInches(materialWidthRaw, patternUnit);
    
    const material = new Material("User Material", materialWidthInInches, patternRepeat);
    const totalLinearFeet = estimateMaterialForRoom(room, material);

    document.getElementById('result').innerText = `You'll need approximately ${totalLinearFeet.toFixed(2)} linear feet of wallpaper.`;
});
