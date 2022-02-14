let instruct; let game; //buttons
let silver = "#c4cedb"; let grey =  "#262732"; let black =  "#000"; let red ="#db3832"//colours
let selected;
distCheck = false;
lineDist = 80;
let localLost = false;
function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "tm_silver_lining_ver2.0", "main");
  shared = partyLoadShared("shared");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
  yay = loadImage("./assets/won_ver2.0.png");
  dead = loadImage("./assets/dead_ver2.0.png");
  
}
function setup() {
  createCanvas(500, 500);
  if (partyIsHost) {
    shared.screenMode = 0;
    shared.array = [];
    shared.lost = false;
    shared.turn = 0;
    shared.resetDraw = [];
    shared.message="hello";
  }
  me.canTurn=true;
  me.localLost=false;
  me.width=1;
  me.message=""
  partyToggleInfo(false);
  buttonPresets();
}
function draw() {
  switch (shared.screenMode) {
    case 0:
      introScreen();
      break;
    case 1:
      instructionScreen();
      break;
    case 2:
      gameScreen();
      break;
    case 3:
      winScreen();   //not implemented
      break;
    case 4:
      loseScreen();   
      break;
  }
}
function introScreen(){
  background(black);
  //resetting shared values
  shared.screenMode = 0;
  shared.array = [];
  shared.lost = false;
  //button position 
  rectMode(CENTER)
  instruct.show(); game.show(); menu.hide();
  instruct.position(windowWidth/2-50, windowHeight/2-100);
  game.position(windowWidth/2-50, windowHeight/2);
}
function instructionScreen(){
  background(black);
  //button position 
  instruct.hide(); game.show(); menu.hide();
  game.position(windowWidth/2-50, 600);
  //rule set
  fill(silver); textFont('jeff-script');
  textSize(30); 
  text("Instructions", 50,50)
  textSize(18);
  text("Draw lines, that's pretty much it", 50,90);
  text("Oh, wait...", 50,120)
  text("Your lines need to be longer than 80px", 50,150)
  text("And, your lines can't intersect any other lines", 50,180)
  text("Make sure your opponent (and not you)", 90,250)
  fill(red);
  text("Crosses a line", 300,350);
}
function gameScreen(){
  if(me.canTurn==true){
    background(black);
    me.message="your turn";
  }
  else{
    background(100);
    me.message="waiting for round to end";
  }
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(500, 600);
  //game mechanics implementation
  printMessage();
  drawLine(shared.array);
  if(shared.array.length>1 && me.canTurn==true){
   planLine(shared.array); 
  } 
}
function winScreen(){
  background("green");
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(windowWidth/2-50, 600);
}
function loseScreen(){
  //background("red");
  if(shared.lost==true && localLost==true){
    image(dead, 0, 0, width, height)
  }
  else if(shared.lost==true && localLost==false){
    image(yay, 0, 0, width, height)
  }
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(windowWidth/2-50, 600);
}

//GAME MECHANIC STARTS HERE
function mousePressed() {
  if (shared.screenMode == 2) {
    turnBased();
  }
}
function turnBased() {
  if (shared.turn < participants.length && me.canTurn==true) {
    drawOnCanvas();
    shared.resetDraw[shared.turn]=false;
    me.canTurn=false;
    shared.turn++;
  }
  else if(shared.turn == participants.length){
    for(i=0;i<shared.resetDraw.length;i++){
      shared.resetDraw[i]=true;
    }
    for (const p of participants) {
      p.canTurn = true;
    }
    console.log("round ended, click again to draw line");
    shared.message="round ended, click again to draw line";
    shared.turn=0;
  }
}
function printMessage(){
  push();
  fill(silver);
  strokeWeight(0);
  if(shared.message!=""){
    text(shared.message, 50, 50);
  }
  if(me.message!=""){
    text(me.message, 50, 80);
  }
  pop();
}
function drawOnCanvas(){
  let canvasBoundaryCheck = canvasBoundary()
  if(canvasBoundaryCheck== true){
    distCheck = distanceCheck(shared.array);
    if (shared.array.length < 2) {
      shared.array.push({ x: mouseX, y: mouseY });
      fill("white");
      ellipse(shared.array[1].x, shared.array[1].x, 3, 3);
      console.log("line started");
      shared.message="Line started";
    } 
    else if (distCheck == true) {
      shared.array.push({ x: mouseX, y: mouseY });
      console.log("line continue");
      shared.message="Line Continues";
      // pointIntersect(mouseX, mouseY, shared.array);
      lineIntersect(shared.array);
    } 
    else console.log("draw a longer line"); 
    shared.message="Draw a longer line";
  }
}
function canvasBoundary(){
  if(mouseX<width && mouseX>0 && mouseY<height && mouseY>0){
    return true;
  }
  else
    console.log("you're trying to click outside the border, you lose a turn")
}
function distanceCheck() {
  len = shared.array.length;
  if (len > 0) {
    lastpoint = shared.array[len - 1];
    d = dist(mouseX, mouseY, lastpoint.x, lastpoint.y);
    if (d > lineDist) {
      return true;
    }
  }
}
function drawLine(lineArr) {
  stroke(255);
  strokeWeight(me.width);
  for (i = 1; i < lineArr.length - 1; i++) {
    j = i + 1;
    line(lineArr[i].x, lineArr[i].y, lineArr[j].x, lineArr[j].y);
  }
}
function planLine(lineArr){
  stroke(150);
  strokeWeight(me.width);
  endPoint=lineArr.length - 1;
  console.log(lineArr,endPoint)
  line(lineArr[endPoint].x, lineArr[endPoint].y, mouseX, mouseY)
}
function lineIntersect(checkPointArr) {
  let totLen = checkPointArr.length;
  let check2 = totLen - 1;
  intersectCheck = false;
  if (check2 > 2) {
    for (let i = 1; i < totLen - 1; i++) {
      if (intersectCheck == false) {
        j = i + 1;
        let check1 = check2 - 1;
        intersectCheck = lineIntersectCalc(
          checkPointArr[check1].x,
          checkPointArr[check1].y,
          checkPointArr[check2].x,
          checkPointArr[check2].y,
          checkPointArr[i].x,
          checkPointArr[i].y,
          checkPointArr[j].x,
          checkPointArr[j].y
        );
      } else {
        console.log("intersects!");
        shared.lost=true;
        localLost=true;
        lost();
      }
    }
  }
}
//source: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function lineIntersectCalc(a, b, c, d, p, q, r, s) {
  var det,
    gamma,
    lambda,
    check = false;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    //check=false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
      check = true;
    }
  }
  return check;
}
function lost() {
  shared.screenMode=4;
}
//GAME MECHANIC ENDS HERE
// changeScene0->4 all change shared screen object
function changeScene0(){
  shared.screenMode=0;
}
function changeScene1(){
  shared.screenMode=1;
}
function changeScene2(){
  shared.screenMode=2;
}
function changeScene3(){
  shared.screenMode=3;
}
function changeScene4(){
  shared.screenMode=4;
}
function buttonPresets(){
  instruct = createButton('Instructions');
  instruct.style('border', 'none');
  instruct.style('background-color', grey);
  instruct.style('color', silver);
  instruct.style('padding', '5px 10px');
  instruct.style('font-family', 'jeff-script');
  instruct.mousePressed(changeScene1);

  game = createButton('Play Game');
  game.style('border', 'none');
  game.style('background-color', grey);
  game.style('color', silver);
  game.style('padding', '5px 10px');
  game.style('font-family', 'jeff-script');
  game.mousePressed(changeScene2);

  menu = createButton('Main Menu');
  menu.style('border', 'none');
  menu.style('background-color', grey);
  menu.style('color', silver);
  menu.style('padding', '5px 10px');
  menu.style('font-family', 'jeff-script');
  menu.mousePressed(changeScene0);
}
