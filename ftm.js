const CELL_SIZE = 40;
const BORDER_SIZE = 2;

const EMPTY = 0;
const LOOT = 1;
const HEART = 2;
const MONSTER = 3;

/* Cells may content: { content: one of the constants, walls: [bool x 4 : NWSE] } */
let grid;

let heroPosition = { x: -1, y: -1 };
let direction = null; /* N, S, W or E */
let hearts = 0;
let heroLoot = 0;

function createGrid(options) {
    if (!options.size) {
        console.error('Size must be filled!');
        return;
    }

    // Style balise
    document.querySelector('head').innerHTML += '<style> \
        td, th { min-width: ' + CELL_SIZE + 'px; height: ' + CELL_SIZE + 'px; } \
        td { border-width: ' + BORDER_SIZE + 'px } \
        #hero { width: ' + (CELL_SIZE + BORDER_SIZE) + 'px; height: ' + (CELL_SIZE + BORDER_SIZE) + 'px; } \
    </style>';

    // Create the grid
    grid = [];
    for (let x = 0; x < options.size; x++) {
        grid.push([]);
        for (let y = 0; y < options.size; y++) {
            grid[x].push({ content: EMPTY, walls: [y === 0, x === options.size - 1, y === options.size - 1, x === 0], frozen: false });
        }
    }

    // Put on the hero
    heroPosition.x = Math.floor(Math.random() * options.size);
    heroPosition.y = Math.floor(Math.random() * options.size);

    // Random walls
    if (options.walls) {
        let walls = options.size * 8;
        while (walls > 0) {
            const randX = Math.floor(Math.random() * options.size);
            const randY = Math.floor(Math.random() * options.size);
            const direction = Math.floor(Math.random() * 4);
            if (!grid[randX][randY].walls[direction]) {
                grid[randX][randY].walls[direction] = true;
                if (direction === 0 && randY > 0) grid[randX][randY - 1].walls[2] = true;
                if (direction === 1 && randX < options.size - 1) grid[randX + 1][randY].walls[3] = true;
                if (direction === 2 && randY < options.size - 1) grid[randX][randY + 1].walls[0] = true;
                if (direction === 3 && randX > 0) grid[randX - 1][randY].walls[1] = true;
                walls--;
            }
        }
    }

    if (options.hearts) {
        let h = 5;
        while (h > 0) {
            const randX = Math.floor(Math.random() * options.size);
            const randY = Math.floor(Math.random() * options.size);
            grid[randX][randY].content = HEART;
            h--;
        }
    }

    if (options.enemies) {
        let m = 10;
        while (m > 0) {
            const randX = Math.floor(Math.random() * options.size);
            const randY = Math.floor(Math.random() * options.size);
            if (grid[randX][randY].content === EMPTY && (heroPosition.x != randX || heroPosition.y != randY)) {
                grid[randX][randY].content = MONSTER;
                grid[randX][randY].monster = 1 + Math.floor(Math.random() * 5);
                m--;
            }
        }
    }

    if (options.loot) {
        let l = 7;
        while (l > 0) {
            const randX = Math.floor(Math.random() * options.size);
            const randY = Math.floor(Math.random() * options.size);
            if (grid[randX][randY].content === EMPTY && (heroPosition.x != randX || heroPosition.y != randY)) {
                grid[randX][randY].content = LOOT;
                l--;
            }
        }
    }

    if (options.ice) {
        let i = 4;
        while (i > 0) {
            const randX = Math.floor(Math.random() * options.size);
            const randY = Math.floor(Math.random() * options.size);
            freeze(randX, randY);
            i--;
        }
    }

    // Display the grid
    updateGrid();

    // Display the hero
    document.querySelector("#game").innerHTML += '<div id="hero" style="left: ' + (CELL_SIZE + heroPosition.x * (CELL_SIZE + BORDER_SIZE))  + 'px; top: ' + (CELL_SIZE + heroPosition.y * (CELL_SIZE + BORDER_SIZE)) + 'px"></div>';
}

function freeze(x, y, deep = 0) {
    if (deep == 3) {
        return;
    }
    if (grid[x] && grid[x][y]) {
        grid[x][y].frozen = true;
        freeze(x - 1, y, deep + 1);
        freeze(x + 1, y, deep + 1);
        freeze(x, y - 1, deep + 1);
        freeze(x, y + 1, deep + 1);
    }
}

function updateGrid() {
    let content = "<table><tr><th></th>";
    for (const c in grid[0]) {
        content += '<th>' + c + '</th>';
    }
    content += "</tr>";
    for (let y = 0; y < grid[0].length; y++) {
        content += '<tr><th>' + y + '</th>';
        for (let x = 0; x < grid.length; x++) {
            const classes = [];
            if (grid[x][y].walls[0]) classes.push('N');
            if (grid[x][y].walls[1]) classes.push('E');
            if (grid[x][y].walls[2]) classes.push('S');
            if (grid[x][y].walls[3]) classes.push('W');
            if (grid[x][y].content === HEART) classes.push('heart');
            else if (grid[x][y].content === MONSTER) classes.push('monster');
            else if (grid[x][y].content === LOOT) classes.push('loot');
            if (grid[x][y].frozen) classes.push('frozen');
            content += '<td class="' + classes.join(' ') + '">';
            if (grid[x][y].content === MONSTER) {
                content += '<span>' + grid[x][y].monster + '</span>';
            }
            content += '</td>';
        }
        content += "</tr>";
    }
    content += "</table>";
    document.querySelector("#grid").innerHTML = content;
}

function updateHero() {
    document.querySelector('#hero').style.left = (CELL_SIZE + heroPosition.x * (CELL_SIZE + BORDER_SIZE)) + 'px';
    document.querySelector('#hero').style.top = (CELL_SIZE + heroPosition.y * (CELL_SIZE + BORDER_SIZE)) + 'px';
    document.querySelector('#hero').classList = [ direction ];
}

function updateHearts() {
    document.querySelector('#hearts').innerHTML = '';
    for (let i = 0; i < hearts; i++) {
        document.querySelector('#hearts').innerHTML += '<div></div>';
    }
}

function updateLoot() {
    document.querySelector('#loot').innerHTML = '';
    for (let i = 0; i < heroLoot; i++) {
        document.querySelector('#loot').innerHTML += '<div></div>';
    }
}

function getHeroPosition() {
    return heroPosition;
}

function setHeroPosition(x, y) {
    if (x < heroPosition.x) {
        direction = 'W';
    } else if (x > heroPosition.x) {
        direction = 'E';
    } else if (y < heroPosition.y) {
        direction = 'N';
    } else if (y > heroPosition.y) {
        direction = 'S';
    }
    heroPosition = { x, y };
    updateHero();
}

function getWalls(x, y) {
    return {
        north: grid[x][y].walls[0],
        east: grid[x][y].walls[1],
        south: grid[x][y].walls[2],
        west: grid[x][y].walls[3]
    };
}

function setHearts(n) {
    hearts = n;
    updateHearts();
}

function getHearts() {
    return hearts;
}

function getCellContent(x, y) {
    return grid[x][y].content;
}

function getMonsterPower(x, y) {
    if (getCellContent(x, y) !== MONSTER) {
        return null;
    }
    return grid[x][y].monster;
}

function killMonster(x, y) {
    grid[x][y].content = EMPTY;
    grid[x][y].monster = null;
    updateGrid();
}

function loot(x, y) {
    if (grid[x][y].content === LOOT) {
        heroLoot++;
        updateLoot();
        grid[x][y].content = EMPTY;
        updateGrid();
    }
}

function getTreasures() {
    return document.querySelectorAll('.loot').length;
}

function isFrozen(x, y) {
    return grid[x][y].frozen;
}