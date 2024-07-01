//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//astronot
let astronotWidth = 46;
let astronotHeight = 46;
let astronotX = boardWidth/2 - astronotWidth/2;
let astronotY = boardHeight*7/8 - astronotHeight;
let astronotRightImg;
let astronotLeftImg;

let astronot = {
    img : null,
    x : astronotX,
    y : astronotY,
    width : astronotWidth,
    height : astronotHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //astronot jump speed
let initialVelocityY = -7; //starting velocity Y
let gravity = 0.35;

//platforms
let platformArray = [];
let platformWidth = 70;
let platformHeight = 20;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw astronot
    // context.fillStyle = "green";
    // context.fillRect(astronot.x, astronot.y, astronot.width, astronot.height);

    //load images
    astronotRightImg = new Image();
    astronotRightImg.src = "./right.png";
    astronot.img = astronotRightImg;
    astronotRightImg.onload = function() {
        context.drawImage(astronot.img, astronot.x, astronot.y, astronot.width, astronot.height);
    }

    astronotLeftImg = new Image();
    astronotLeftImg.src = "./left.png";

    platformImg = new Image();
    platformImg.src = "./wood.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveastronot);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //astronot
    astronot.x += velocityX;
    if (astronot.x > boardWidth) {
        astronot.x = 0;
    }
    else if (astronot.x + astronot.width < 0) {
        astronot.x = boardWidth;
    }

    velocityY += gravity;
    astronot.y += velocityY;
    if (astronot.y > board.height) {
        gameOver = true;
    }
    context.drawImage(astronot.img, astronot.x, astronot.y, astronot.width, astronot.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && astronot.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(astronot, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "red";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 30,);

    if (gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveastronot(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        astronot.img = astronotRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        astronot.img = astronotLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        astronot = {
            img : astronotRightImg,
            x : astronotX,
            y : astronotY,
            width : astronotWidth,
            height : astronotHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/0,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*2/3); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*2/3); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(20*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}