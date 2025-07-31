import * as PIXI from "pixi.js";
import Player from "./player";
import Zombie from "./zombie";
//import Matter from "matter-js";

let canvasSize = 256;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  //будуємо сцену
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

let player = new Player({ app }); //створюємо гравця
let zombie = new Zombie({ app, player }); //створюємо зомбі

app.ticker.add((delta) => {
  player.update(); //оновлюємо гравця
  zombie.update(); //оновлюємо зомбі
});


