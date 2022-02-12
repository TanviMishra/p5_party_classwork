function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com","tm",
    "main"
  );
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(500, 500);
  noStroke();
  shared.x = shared.x || 0;
  shared.y = shared.y || 0;
  shared.clickHistory = shared.clickHistory || []; //stores all the click
  partyToggleInfo(false);
}

function draw() {
  background(100);
  textFont('jeff-script');
  text('word', 10, 90);
}