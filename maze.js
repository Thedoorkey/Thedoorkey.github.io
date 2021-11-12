//EDITABLE CONSTANTS
const WIDTH = 500;              //size of play area, must be a multiple of 100      
const LINE_WIDTH = 60;          //width of maze paths, any even number between 20 and 90 is good

//FIXED CONSTANTS (DO NOT CHANGE)
const DELTA_X = WIDTH/100;
const RECT_RADIUS = LINE_WIDTH/2;

//VARIABLES
let mapArray = [];              //array of midpoints of the squares of the map grid
let cornerArray = [];           //array of corners of the squares
let map = [];                   //array to store the order that points were connected to
let startPoint = 0;             //stores the point that was picked to start generating the maze from
let finalPoint = 0;             //stores the final point traveled to while generating the maze
let currPos = [0, 0];           //stores mouse's current position in an array
let mazeGenerated = false;      //tells when a maze is generated, resets every time a maze is beaten/lost
let started = false;            //tells if the user has started playing a maze by hovering over the orange starting square
let init = false;               //setup() is called to reset the board, don't want to run some parts of it more than once so i use this

function setup() {  
    if (!init) { // everything in this if block will only run once
        createCanvas(WIDTH, WIDTH);
        frameRate(60);
        //these for loops populate the arrays with all the required values
        for (let x = 50; x < WIDTH; x+= 100) {
            for (let y = 50; y < WIDTH; y+= 100) {
                mapArray.push([x, y, false]); //the third item will be used to determine if the point was 'visited' by the generation algorithm
            }
        }
        for (let x = 0; x <= WIDTH; x+= 100) {
            for (let y = 0; y <= WIDTH; y+= 100) {
                cornerArray.push([x, y]);
            }
        }
        init = true;
    }
    background('maroon');
    textSize(20);
    textAlign(CENTER, CENTER);
    let textToShow = 'Rules:\nMove the mouse to the orange box,\n or touch and hold the orange box to start.\nStay in the maze!\nGet to the blue box and you win!\nPress a key or touch the screen to play a maze.';
    fill('gold');
    strokeWeight(1);
    stroke('black');
    text(textToShow, WIDTH/2, WIDTH/2);
    mazeGenerated = false;
}

function draw() {
    if (mazeGenerated && !started) { isItTime(); } //when maze is generated, waits for user to hover over orange starting square
    if (started) { //runs while user is playing
        if (!inBounds()) { //if user tries to cheat and/or is bad at maze navigation this will run
            background('maroon');
            started = false;
            mazeGenerated = false;
            alert("You went out of bounds, try again!");
            setup();
        }
        else if (finishLine()) { //runs if the user makes it to blue square
            background('maroon');
            started = false;
            mazeGenerated = false;
            alert("Good job! You beat the maze!")
            setup();
        }
    }
}

async function isItTime() { //async because the page will hang if it isn't ¯\_(ツ)_/¯
    let closestX = round((mouseX+50)/100)*100-50;   //these two vars store the mouse's x/y position,
    let closestY = round((mouseY+50)/100)*100-50;   //rounded to the nearest midpoint of a piece of the map
    let relativeX = Math.round(Math.abs(mouseX - closestX));    //gets relative position of mouse to the nearest midpoint,
    let relativeY = Math.round(Math.abs(mouseY - closestY));    //rounded to the nearest integer

    currPos = [closestX, closestY]; //stores current mouse location to array
    if (currPos[0] == startPoint[0] && currPos[1] == startPoint[1] && !started && relativeX <= RECT_RADIUS && relativeY <= RECT_RADIUS) { //pretty long if statement we got here. hello from the far east
        started = true;
        fill('red');
        rect(startPoint[0], startPoint[1], RECT_RADIUS, RECT_RADIUS);
        fill('white');
    }
}

function finishLine() { //basically the same as isItTime() but for checking if user made it to blue finish square
    let closestX = round((mouseX+50)/100)*100-50;
    let closestY = round((mouseY+50)/100)*100-50;

    currPos = [closestX, closestY];
    if (currPos[0] == finalPoint[0] && currPos[1] == finalPoint[1]) {
        return true;
    }
    return false;
}

function inBounds() { //p5js doesn't have a method for checking what color the mouse is hovering over so we have this monstrosity instead
    let connectOK = false;
    let connectX = false;
    let connectY = false;

    let closestX = round((mouseX+50)/100)*100-50;   //these two vars store the mouse's x/y position,
    let closestY = round((mouseY+50)/100)*100-50;   //rounded to the nearest midpoint of a piece of the map

    let count = 0;
    let posNum = 0;
    mapArray.forEach((pt) => {
        if (pt[0] == closestX && pt[1] == closestY) { posNum = count; }
        count++;
    });

    let connections = map.filter( function( el ) {
        return !!~el.indexOf(posNum);
    } );

    let relativeX = Math.round(Math.abs(mouseX - closestX));
    let relativeY = Math.round(Math.abs(mouseY - closestY));
    
    if (relativeX <= LINE_WIDTH/2 && relativeY <= LINE_WIDTH/2) { connectOK = true; }
    else if (relativeX > LINE_WIDTH/2 && relativeY > LINE_WIDTH/2) { connectOK = false; }
    else { //i'm sure this section of code could be condensed but my brain's not large enough to do it
        if (relativeX > LINE_WIDTH/2 && mouseX > closestX) {
            connections.forEach((con) => {
                if (con.indexOf(posNum+DELTA_X) != -1) {
                    connectX = true;
                }
            });
        }
        else if (relativeX > LINE_WIDTH/2 && mouseX < closestX) {
            connections.forEach((con) => {
                if (con.indexOf(posNum-DELTA_X) != -1) {
                    connectX = true;
                }
            });
        }
        else if (relativeX <= LINE_WIDTH/2) { connectX = true; }
        if (mouseY > closestY && relativeY > LINE_WIDTH/2) {
            connections.forEach((con) => {
                if (con.indexOf(posNum+1) != -1) {
                    connectY = true;
                }
            });
        }
        else if (mouseY < closestY && relativeY > LINE_WIDTH/2) {
            connections.forEach((con) => {
                if (con.indexOf(posNum-1) != -1) {
                    connectY = true;
                }
            });
        }
        else if (relativeY <= LINE_WIDTH/2) { connectY = true; }
        if (connectX && connectY) { connectOK = true; }
    }
    
    return connectOK;
}

function keyPressed() {
    background('maroon');
    started = false;
    map = [];
    fill('white');
    let mapPoint = round(random(0, mapArray.length)); //random starting point
    startPoint = [mapArray[mapPoint][0], mapArray[mapPoint][1]];
    let visitedCells = [];  //stack for cells visited by algorithm
    let connectPoint = -1;
    let connectDir = 0;
    while (mapArray.some(row => row.includes(false))) { //where would society be without stackoverflow
        
        visitedCells.push(mapPoint);
        
        do { //select direction to connect line to
            let northVisited = (mapArray[mapPoint][1] == 50 || mapArray[mapPoint-1][2]);
            let eastVisited = (mapArray[mapPoint][0] == WIDTH-50 || mapArray[mapPoint+DELTA_X][2]);
            let southVisited = (mapArray[mapPoint][1] == WIDTH-50 || mapArray[mapPoint+1][2]);
            let westVisited = (mapArray[mapPoint][0] == 50 || mapArray[mapPoint-DELTA_X][2]);

            if (northVisited && eastVisited && southVisited && westVisited) {
                try {
                    mapPoint = visitedCells.pop();
                }
                catch {
                    break;
                }
            }

            connectDir = round(random(0, 3)); //0 = north, 1 = east, 2 = south, 3 = west
            if (connectDir == 0 && !northVisited) {
                connectPoint = mapPoint - 1;
            }
            else if (connectDir == 1 && !eastVisited) {
                connectPoint = mapPoint + DELTA_X;
            }
            else if (connectDir == 2 && !southVisited) {
                connectPoint = mapPoint + 1;
            }
            else if (connectDir == 3 && !westVisited) {
                connectPoint = mapPoint - DELTA_X;
            }
        } while (connectPoint == -1 || mapArray[connectPoint][2]);

        stroke('white');
        strokeWeight(LINE_WIDTH);
        strokeCap(PROJECT);
        line(mapArray[mapPoint][0], mapArray[mapPoint][1], mapArray[connectPoint][0], mapArray[connectPoint][1]);
        mapArray[mapPoint][2] = true;
        if (mapPoint != connectPoint ) { map.push([mapPoint, connectPoint]); }
        mapPoint = connectPoint;
    }

    finalPoint = [mapArray[mapPoint][0], mapArray[mapPoint][1]];
    strokeWeight(1);
    rectMode(RADIUS);
    fill('orange');
    rect(startPoint[0], startPoint[1], RECT_RADIUS, RECT_RADIUS);
    fill('blue');
    rect(finalPoint[0], finalPoint[1], RECT_RADIUS, RECT_RADIUS);
    fill('white');

    for (let i = 0; i < mapArray.length; i++) {
        mapArray[i][2] = false; //resets all possible travel points to false since we're done generating the maze now
    }
    
    mazeGenerated = true;
}

function mousePressed() {
    if (mouseButton === RIGHT) { //right clicking kills the in bounds detection, no cheating allowed
        alert("No right clicking allowed!");
        background('maroon');
        started = false;
        mazeGenerated = false;
        setup();
    }
}

function touchStarted() {
    if (!mazeGenerated) { keyPressed(); }
    else if (!started) { isItTime(); }
}

function touchReleased() {
    if (started && !finishLine()) {
        background('maroon');
        started = false;
        mazeGenerated = false;
        alert("You let go too soon, try again!");
        setup();
    }
}