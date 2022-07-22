const options = {
    size: 12,
    walls: true,
    hearts: true,
    enemies: true,
    loot: true,
    ice: true,
};

createGrid(options);
setHearts(3);


function checkHeart() {
    let heroPosi = getHeroPosition();
    if (getCellContent(heroPosi.x, heroPosi.y) === HEART && getHearts() < 5) {
        setHearts(getHearts() + 1);
    }
}

function checkEnemy() {
    let heroPosi = getHeroPosition();
    let tadmorv = getMonsterPower(heroPosi.x, heroPosi.y);
    if (getCellContent(heroPosi.x, heroPosi.y) === MONSTER) {
        setHearts(getHearts() - tadmorv);
        if (getHearts() <= 0) {
            alert("Game Over !");
        }
        killMonster(heroPosi.x, heroPosi.y);
    }
}

function checkLoot() {
    let heroPosi = getHeroPosition();
    if (getCellContent(heroPosi.x, heroPosi.y) === LOOT) {
        loot(heroPosi.x, heroPosi.y);
        if (getTreasures() === 0) {
            alert("Bien joué mamene !");
        }
    }
}

function goUp() {
    let heroPosi = getHeroPosition();
    let wallPosi = getWalls(heroPosi.x, heroPosi.y);
    if (!wallPosi.north) {
        setHeroPosition(heroPosi.x, heroPosi.y - 1);
        checkHeart();
        checkEnemy();
        checkLoot();
        if (isFrozen(heroPosi.x, heroPosi.y - 1)) { 
            goUp();
        }
    }
}
function goDown() {
    let heroPosi = getHeroPosition();
    let wallPosi = getWalls(heroPosi.x, heroPosi.y);
    if (!wallPosi.south) {
        setHeroPosition(heroPosi.x, heroPosi.y + 1);
        checkHeart ();
        checkEnemy();
        checkLoot();
        if (isFrozen(heroPosi.x, heroPosi.y + 1)) { 
            goDown();
        }
    }
}
function goRight() {
    let heroPosi = getHeroPosition();
    let wallPosi = getWalls(heroPosi.x, heroPosi.y);
    if (!wallPosi.east) {
        setHeroPosition(heroPosi.x + 1, heroPosi.y);
        checkHeart ();
        checkEnemy();
        checkLoot();
        if (isFrozen(heroPosi.x + 1, heroPosi.y)) { 
            goRight();
        }
    }
}
function goLeft() {
    let heroPosi = getHeroPosition();
    let wallPosi = getWalls(heroPosi.x, heroPosi.y);
    if (!wallPosi.west) {
        setHeroPosition(heroPosi.x - 1, heroPosi.y);
        checkHeart ();
        checkEnemy();
        checkLoot();
        if (isFrozen(heroPosi.x - 1, heroPosi.y)) { 
            goLeft();
        }
    }
}

function checkKey(e) {
    e = e || window.event;
  
    if (e.keyCode == "38") {
      goUp();
    } else if (e.keyCode == "40") {
      goDown();
    } else if (e.keyCode == "37") {
      goLeft();
    } else if (e.keyCode == "39") {
      goRight();
    }
      return false;
  } 
  

document.querySelector('#go-up').onclick = goUp;
document.querySelector('#go-down').onclick = goDown;
document.querySelector('#go-right').onclick = goRight;
document.querySelector('#go-left').onclick = goLeft;

document.onkeydown = checkKey;


