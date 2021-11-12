const WIDTH = 500;      //width of play field
const HEIGHT = 500;     //height of play field
const RAD_BALL = 30;    //radius of ball
const RAD_BOX = 40;     //radius of box
const TIME = 30;        //time limit per play

let circleX = -(RAD_BALL*2);
let circleY = -(RAD_BALL*2);
let boxX = -(RAD_BOX*2);
let boxY = -(RAD_BOX*2);

let score = 0;
let time = 0;
let started = false;
let ended = false;
let clickedOnBall = false;
let timerVar;
/* TODO TO MAKE THIS WORK:
* generate a ball and a box in random positions on ground [X]
* store current pos of ball and pos of box as vars [X]
* if ball and box are overlapping, regenerate them until they aren't [X]
* when mouse held down, check if mouse is over ball [X]
* if so, move ball along with mouse [X]
* if ball is within bounds of box, mark success []
*/

function setup() {
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    background('maroon');
}

function draw() {
    if (!ended) { background('maroon'); }
    if(!started && !ended) {
        fill('gold');
        textSize(20);
        let texttoShow = "Drag the balls into the boxes to get points!\nHow many points can you get in " + TIME + " seconds?\n\nPress Enter to start!";
        textAlign(CENTER, CENTER);
        text(texttoShow, WIDTH/2, WIDTH/2);
    }
    if (!ended) {
        strokeWeight(1);
        stroke('black');
        fill(150, 90, 0);
        square(boxX, boxY, RAD_BOX*2);
        fill('green');
        circle(circleX, circleY, RAD_BALL*2);
    }
    if(started && !ended) {
        showScore();
        let timeText = "Time Left: " + time;
        textAlign(CENTER,CENTER);
        textSize(20);
        strokeWeight(0);
        fill('gold');
        text(timeText, WIDTH - 105, 25);
        if (inBox()) {
            score++;
            clickedOnBall = false;
            drawShapes();
        }
    }
}

function keyPressed() {
    if (!(keyCode === ENTER) || started) { return false; }
    if (!started) {
        started = true;
        ended = false;
        time = TIME;
        score = 0;
        timerVar = setInterval(timer, 1000);
    }
    drawShapes();
}

function drawShapes() {
    background('maroon');
    circleX = round(random(RAD_BALL, WIDTH-RAD_BALL));
    circleY = round(random(RAD_BALL, HEIGHT-RAD_BALL));
    boxX = round(random(0, WIDTH-(RAD_BOX*2)));
    boxY = round(random(0, HEIGHT-(RAD_BOX*2)));
    while (Math.abs(circleX-boxX) < (RAD_BOX*2)+RAD_BALL) { boxX = round(random(0, WIDTH-(RAD_BOX*2))); } //prevents overlapping
    while (Math.abs(circleY-boxY) < (RAD_BOX*2)+RAD_BALL) { boxY = round(random(0, HEIGHT-(RAD_BOX*2))); } //ditto
    strokeWeight(1);
    stroke('black');
    fill('green');
    circle(circleX, circleY, RAD_BALL*2);
    fill(150, 90, 0);
    square(boxX, boxY, RAD_BOX*2);
}

function mousePressed() {
    if(withinBall()) { clickedOnBall = true; }
    else { clickedOnBall = false; }
}

function mouseDragged() {
    if(withinBall() && clickedOnBall) {
        let relX = circleX-mouseX;
        let relY = circleY-mouseY;
        circleX = circleX - relX;
        circleY = circleY - relY;
    }
}

function showScore() {
    textAlign(LEFT, CENTER);
    textSize(20);
    strokeWeight(0);
    fill('gold');
    text("Score: " + score, 5, 20)
}

function withinBall() {
    let relXSquared = Math.pow(Math.abs(circleX-mouseX), 2);
    let relYSquared = Math.pow(Math.abs(circleY-mouseY), 2);
    let distfromBall = Math.sqrt(relXSquared+relYSquared);
    if (distfromBall < RAD_BALL) { return true; }
    return false;
}

function inBox() {
    let relX = Math.abs(boxX+RAD_BOX - circleX);
    let relY = Math.abs(boxY+RAD_BOX - circleY);
    if (relX < RAD_BOX-(RAD_BALL+1) && relY < RAD_BOX-(RAD_BALL+1)) { return true; }
}

function timer() {
    if (started)
    {
        if(time > 0)
        {
            fill('maroon');
            rect(WIDTH - 210, 11, 210, 40);
            time--;
        } 
        else if(time <= 0)
        {
            avengersEndGame();
        }
    }    
}

function avengersEndGame() {
    background('maroon');
    fill('gold');
    text('You put away ' + score + ' balls in ' + TIME + ' seconds!\n\n Press Enter to play again!', WIDTH/2, WIDTH/2);
    ended = true;
    started = false;
    clearInterval(timerVar);
}