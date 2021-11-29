//reaction time game
//editable constants
const WIDTH = 500;
const FRAMERATE = 60;
const TIME = 30;

//don't edit these constants
let init = false;
const RAD_BUTTON = 100;
let buttonX = WIDTH/2;
let buttonY = WIDTH/2;
let score = 0;
let timeLeft = TIME;
let started = false;
let gameEnd = false;
let timerVar;
let buttonSound;
let endSound;
let missSound;
let numberOfTimesClicked = 0;

function preload() {
    soundFormats('mp3', 'ogg');
    endSound = loadSound('sounds/endgamesound.mp3');
    buttonSound = loadSound('sounds/boink.mp3');
    missSound = loadSound('sounds/miss.mp3');
    backgroundMusic = loadSound('sounds/bgmusic1.mp3');
}

function setup() {  
    if (!init) { // everything in this if block will only run once
        createCanvas(WIDTH, WIDTH);
        frameRate(FRAMERATE);
        init = true;
        
    }
    background('maroon');
    textSize(20);
    textAlign(CENTER, CENTER);
    let textToShow = 'Click as many circles as you can in ' + TIME + ' seconds!\n\nClick the circle to start!';
    fill('gold');
    strokeWeight(1);
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
    background('maroon');
    fill('gold');
    strokeWeight(1);
    stroke('black');
    circle(buttonX, buttonY, RAD_BUTTON);
    let timeText2 = "Time Left: " + timeLeft;
    textAlign(CENTER,CENTER);
    textSize(30);
    strokeWeight(0);
    fill('gold');
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
            fill('gold');
            text(timeStart, WIDTH - 105, 25);     
            backgroundMusic.play();
            numberOfTimesClicked = 0;
        } 
        buttonSound.play();
        numberOfTimesClicked++;
    }
    else if(!checkInBounds())
    {
        missSound.play();
        numberOfTimesClicked++;
    }
    return false;
}

function endGame(totalScore)
{
    background('maroon');
    let finalScore = "You clicked " + totalScore;
    if (totalScore == 1) { finalScore += " button"; }
    else { finalScore += " buttons"; }
    finalScore += " in " + TIME + " seconds!"
    let accuracyScore = (totalScore / numberOfTimesClicked)*100;
    let accuracyText = "Accuracy: " + round(accuracyScore, 2) + "%";
    textAlign(CENTER,CENTER);
    textSize(30);
    strokeWeight(0);
    fill('gold');
    text(finalScore, WIDTH/2, (WIDTH*5)/18);
    text(accuracyText, WIDTH/2, (WIDTH*13/18));
    started = false;
    buttonX = WIDTH/2;
    buttonY = WIDTH/2;
    fill('green');
    strokeWeight(1);
    circle(WIDTH/2,WIDTH/2,RAD_BUTTON*1.5);
    textSize(40);
    textAlign(CENTER,CENTER);
    strokeWeight(0);
    fill('gold');
    text("Play\nAgain!", (WIDTH/2), WIDTH/2);
    gameEnd = true;
    clearInterval(timerVar);
    timeLeft = TIME;
    score = 0;
    endSound.play();
    backgroundMusic.stop();
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
            fill('maroon');
            rect(WIDTH - 210, 11, 210, 40);
            timeLeft--;
            let timeText = "Time Left: " + timeLeft;
            textAlign(CENTER,CENTER);
            textSize(30);
            strokeWeight(0);
            fill('gold');
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
        fill('gold');
        text(scoreText, 65, 25);
    }
    if(newScore >= 10)
    {
        let scoreText = "Score: " + newScore;
        textAlign(CENTER,CENTER);
        textSize(30);
        strokeWeight(0);
        fill('gold');
        text(scoreText, 72, 25);
    }
}
