// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball
class Ball {

constructor(x, y, radius, speedX, speedY, color) {
this.x = x;
this.y = y;
this.radius = radius;
this.speedX = speedX;
this.speedY = speedY;
this.color = color;
}

draw() {
ctx.beginPath();
ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
ctx.fillStyle = this.color;
ctx.fill();
ctx.closePath();
}

move() {

this.x += this.speedX;
this.y += this.speedY;

// rebote arriba y abajo
if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
this.speedY = -this.speedY;
}

}

reset() {
this.x = canvas.width/2;
this.y = canvas.height/2;
this.speedX = -this.speedX;
}

}

// Clase Paddle
class Paddle {

constructor(x,y,width,height,color,isPlayer=false) {

this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.color = color;
this.speed = 6;
this.isPlayer = isPlayer;

}

draw(){

ctx.fillStyle = this.color;
ctx.fillRect(this.x,this.y,this.width,this.height);

}

move(direction){

if(direction === "up" && this.y > 0){

this.y -= this.speed;

}

else if(direction === "down" && this.y + this.height < canvas.height){

this.y += this.speed;

}

}

autoMove(ball){

if(ball.y < this.y + this.height/2){

this.y -= this.speed;

}

else if(ball.y > this.y + this.height/2){

this.y += this.speed;

}

}

}

// Clase Game
class Game {

constructor(){

// 5 pelotas
this.balls = [

new Ball(400,300,10,3,3,"white"),
new Ball(400,300,8,4,3,"yellow"),
new Ball(400,300,12,5,4,"red"),
new Ball(400,300,6,4,5,"cyan"),
new Ball(400,300,14,3,4,"lime")

];

// paleta jugador doble altura
this.paddle1 = new Paddle(
0,
canvas.height/2 - 100,
10,
200,
"blue",
true
);

// paleta CPU
this.paddle2 = new Paddle(
canvas.width-10,
canvas.height/2 - 50,
10,
100,
"orange"
);

this.keys = {};

}

draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

this.balls.forEach(ball => ball.draw());

this.paddle1.draw();
this.paddle2.draw();

}

update(){

this.balls.forEach(ball => {

ball.move();

// colisión jugador
if(
ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
ball.y >= this.paddle1.y &&
ball.y <= this.paddle1.y + this.paddle1.height
){

ball.speedX = -ball.speedX;

}

// colisión CPU
if(
ball.x + ball.radius >= this.paddle2.x &&
ball.y >= this.paddle2.y &&
ball.y <= this.paddle2.y + this.paddle2.height
){

ball.speedX = -ball.speedX;

}

// punto marcado
if(ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width){

ball.reset();

}

});

// control jugador
if(this.keys["ArrowUp"]){

this.paddle1.move("up");

}

if(this.keys["ArrowDown"]){

this.paddle1.move("down");

}

// IA CPU sigue la primera pelota
this.paddle2.autoMove(this.balls[0]);

}

handleInput(){

window.addEventListener("keydown",(e)=>{

this.keys[e.key] = true;

});

window.addEventListener("keyup",(e)=>{

this.keys[e.key] = false;

});

}

run(){

this.handleInput();

const gameLoop = ()=>{

this.update();
this.draw();

requestAnimationFrame(gameLoop);

};

gameLoop();

}

}

// iniciar juego
const game = new Game();
game.run();