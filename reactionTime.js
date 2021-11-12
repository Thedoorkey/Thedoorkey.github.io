//reaction time game
//editable constants
const WIDTH = 500;
const FRAMERATE = 60;

//don't edit these constants
let init = false;
const RAD_BUTTON = 100;
let buttonX = WIDTH/2;
let buttonY = WIDTH/2;
let score = 0;
let timeLeft = 30;
let started = false;
let gameEnd = false;
let timerVar;

function setup() {  
    if (!init) { // everything in this if block will only run once
        createCanvas(WIDTH, WIDTH);
        frameRate(FRAMERATE);
        init = true;
        
    }
    background(220);
    textSize(20);
    textAlign(CENTER, CENTER);
    let textToShow = 'Click as many circles as you can in 30 seconds!\n\nClick the circle to start!';
    fill('black');
    strokeWeight(0);
    stroke('black');
    text(textToShow, (WIDTH/2), ((3*WIDTH)/4));
    fill('green');
    strokeWeight(1);
    stroke('black');
    circle(WIDTH/2,WIDTH/2,RAD_BUTTON);
}

function draw() {
    if (started)
    {
        scoreText(score);
    }
}

function createNewButton()
{
    let tempX = buttonX;
    let tempY = buttonY;
    buttonX = round(random(RAD_BUTTON + 25, WIDTH-RAD_BUTTON-25));
    buttonY = round(random(RAD_BUTTON + 25, WIDTH-RAD_BUTTON-25));
    while (Math.abs(tempX - buttonX) < (RAD_BUTTON/2)) { buttonX = round(random((RAD_BUTTON/2) + 25, WIDTH-(RAD_BUTTON/2)-25)); }
    while (Math.abs(tempY - buttonY) < (RAD_BUTTON/2)) { buttonY = round(random((RAD_BUTTON/2) + 25, WIDTH-(RAD_BUTTON/2)-25)); }
    background(220);
    fill('gold');
    strokeWeight(1);
    stroke('black');
    circle(buttonX, buttonY, RAD_BUTTON);
    let timeText2 = "Time Left: " + timeLeft;
    textAlign(CENTER,CENTER);
    textSize(30);
    strokeWeight(0);
    fill('black');
    text(timeText2, WIDTH - 105, 25);
    
}

function mousePressed()
{
    //let the if statement calculate where the mouse is based on absolute value of X and Y difference from center of button, 
    //square both X and Y, add them together, then square root that, if it is below RAD_BUTTON then it's inbounds
    if(checkInBounds())
    {
        score++;
        createNewButton();
        if (!started)
        {
            started = true;
            timerVar = setInterval(timer, 1000);
            let timeStart = "Time Left: " + timeLeft;
            textAlign(CENTER,CENTER);
            textSize(30);
            strokeWeight(0);
            fill('black');
            text(timeStart, WIDTH - 105, 25);
        } 
    }
    return false;
}

function endGame(totalScore)
{
    fill(220, 220, 220, 255);
    rect(0,0, WIDTH, WIDTH);
    let finalScore = "You clicked " + totalScore + " buttons in 30 seconds!";
    textAlign(CENTER,CENTER);
    textSize(30);
    strokeWeight(0);
    fill('black');
    text(finalScore, WIDTH/2, (WIDTH*5)/18);
    started = false;
    buttonX = WIDTH/2;
    buttonY = WIDTH/2;
    fill('green');
    strokeWeight(1);
    circle(WIDTH/2,WIDTH/2,RAD_BUTTON*2);
    textSize(40);
    textAlign(CENTER,CENTER);
    strokeWeight(0);
    fill('black');
    text("Play\nAgain!", (WIDTH/2)+5, WIDTH/2);
    gameEnd = true;
    clearInterval(timerVar);
    timeLeft = 30;
    score = 0;
}

function checkInBounds()
{
    let inbounds = false;
    let relativeX = Math.pow(Math.abs(mouseX-buttonX),2);
    let relativeY = Math.pow(Math.abs(mouseY-buttonY),2);
    let length = round(Math.sqrt(relativeX + relativeY));
    if(length <= (RAD_BUTTON/2) && !gameEnd)
    {
        inbounds = true;
    }
    else if(length <= (RAD_BUTTON) && gameEnd)
    {
        inbounds = true;
        gameEnd = false;
    }
    return inbounds;
}

//create a variable to store the time left, have it start drawing when they start the game
function timer()
{
    if (started)
    {
        if(timeLeft > 0)
        {
            fill(220);
            rect(WIDTH - 210, 11, 210, 40);
            timeLeft--;
            let timeText = "Time Left: " + timeLeft;
            textAlign(CENTER,CENTER);
            textSize(30);
            strokeWeight(0);
            fill('black');
            text(timeText, WIDTH - 105, 25);
        } 
        else if(timeLeft <= 0)
        {
            endGame(score);
        }
    }

}


function scoreText(newScore)
{
    if(newScore < 10)
    {
        let scoreText = "Score: " + newScore;
        textAlign(CENTER,CENTER);
        textSize(30);
        strokeWeight(0);
        fill('black');
        text(scoreText, 65, 25);
    }
    if(newScore >= 10)
    {
        let scoreText = "Score: " + newScore;
        textAlign(CENTER,CENTER);
        textSize(30);
        strokeWeight(0);
        fill('black');
        text(scoreText, 72, 25);
    }
}

