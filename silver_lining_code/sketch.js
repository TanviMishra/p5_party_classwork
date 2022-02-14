let instruct; let game; //buttons
let silver = "#c4cedb";
let grey = "#262732";
let black = "#000";
let selected;
distCheck = false;
lineDist = 80;
function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com", "tm_silver_lining_1",
    "main"
  );
  shared = partyLoadShared("shared");
}
function setup() {
  createCanvas(500, 500);
  if (partyIsHost) {
    shared.screenMode = 2;
    shared.array = [];
    shared.lost = false;
  }
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
      winScreen();
      break;
    case 4:
      loseScreen();
      break;
  }
}
function introScreen() {
  background(black);
  //resetting shared values
  shared.screenMode = 0;
  shared.array = [];
  shared.lost = false;
  //button position 
  rectMode(CENTER)
  instruct.show(); game.show(); menu.hide();
  instruct.position(windowWidth / 2 - 50, windowHeight / 2 - 100);
  game.position(windowWidth / 2 - 50, windowHeight / 2);
}
function instructionScreen() {
  background(black);
  //button position 
  instruct.hide(); game.show(); menu.hide();
  game.position(windowWidth / 2 - 50, 600);
  //rule set
  fill(silver); textFont('jeff-script');
  textSize(24);
  text("Instructions", 50, 50)
  textSize(18);
  text("Draw Lines, that's pretty much it", 50, 90)
}
function gameScreen() {
  background(black);
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(windowWidth / 2 - 50, 600);
  //game mechanics implementation
  drawLine(shared.array);
}
function winScreen() {
  background("green");
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(windowWidth / 2 - 50, 600);
}
function loseScreen() {
  background("red");
  //button position 
  instruct.hide(); game.hide(); menu.show();
  menu.position(windowWidth / 2 - 50, 600);
}

//GAME MECHANIC STARTS HERE
function mousePressed() {
  if (shared.screenMode == 2) {
    distCheck = distanceCheck(shared.array);
    if (shared.array.length < 1) {
      shared.array.push({ x: mouseX, y: mouseY });
      console.log("line started")
    } else if (distCheck == true) {
      shared.array.push({ x: mouseX, y: mouseY });
      console.log("line continue")
      // pointIntersect(mouseX, mouseY, shared.array);
      lineIntersect(shared.array);
    } else console.log("draw a longer line");
  }
  lost();
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
  for (i = 0; i < lineArr.length - 1; i++) {
    j = i + 1;
    line(lineArr[i].x, lineArr[i].y, lineArr[j].x, lineArr[j].y);
  }
}
function lineIntersect(checkPointArr) {
  let totLen = checkPointArr.length;
  let check2 = totLen - 1;
  intersectCheck = false;
  if (check2 > 2) {
    for (let i = 0; i < totLen - 1; i++) {
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
        shared.lost = true
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
//GAME MECHANIC ENDS HERE
// changeScene0->4 all change shared screen object
function changeScene0() {
  shared.screenMode = 0;
}
function changeScene1() {
  shared.screenMode = 1;
}
function changeScene2() {
  shared.screenMode = 2;
}
function changeScene3() {
  shared.screenMode = 3;
}
function changeScene4() {
  shared.screenMode = 4;
}
function buttonPresets() {
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
function lost() {
  if (shared.lost == true) {
    shared.screenMode = 4;
  }
}