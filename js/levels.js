const tileSize = 32;
let levelData = [];

const tileImages = {
    '3': new Image(),
    '6': new Image()
};

tileImages['3'].src = '/images/spikes.png';
tileImages['6'].src = '/images/spikes_copy.png';

async function loadLevel(url) {
    const response = await fetch(url);
    const text = await response.text();
    
    levelData = text.trim().split('\n').map(row => row.split(''));
    
    console.log('Level Loaded:', levelData);
    
    restartGame(); 
}

function drawLevel() {
    levelData.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tileImages[tile]) {
                c.drawImage(tileImages[tile], x * tileSize, y * tileSize, tileSize, tileSize);
            } else {
                if (tile === '1') {
                    c.fillStyle = 'gray';
                } else if (tile === '2') {
                    let gradient = c.createLinearGradient(x * tileSize, y * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);  
                    gradient.addColorStop(0.5, "white");  
                    gradient.addColorStop(1, "black");
                    c.fillStyle = gradient;
                } else {
                    return;
                }
                c.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        });
    });
}

function preloadImages() {
    return Promise.all(Object.values(tileImages).map(img => new Promise(resolve => img.onload = resolve)));
}

preloadImages().then(() => {
    console.log("Tile images loaded!");
});
