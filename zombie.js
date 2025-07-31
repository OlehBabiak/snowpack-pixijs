import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Zombie {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;

    const radius = 16; //радіус ворога
    this.speed = 2; //швидкість ворога
    this.zombie = new PIXI.Graphics(); //створюємо графіку для ворога
    let r = this.randomSpawnPoint(); //отримуємо координати для ворога
    this.zombie.position.set(r.x, r.y); //встановлюємо позицію ворога
    this.zombie.beginFill(0x9b1c31); //колір ворога
    this.zombie.drawCircle(0, 0, radius); //малюємо коло ворога
    this.zombie.endFill(); //закінчуємо малювати
    app.stage.addChild(this.zombie); //додаємо ворога на сцену
  }

  update() {
    //метод для оновлення ворога
    let e = new Victor(this.zombie.position.x, this.zombie.position.y); //створюємо вектор для ворога
    let s = new Victor(this.player.position.x, this.player.position.y); //створюємо вектор для квадрата
    if (e.distance(s) < this.player.width ) {
      //якщо відстань між квадратом і ворогом менша за суму їх радіусів
      let r = this.randomSpawnPoint(); //отримуємо нові координати для ворога
      this.zombie.position.set(r.x, r.y); //встановлюємо нову позицію
      return; //виходимо з функції, щоб не рухати ворога
    }

    let d = s.subtract(e); //отримуємо вектор від ворога до квадрата
    let v = d.normalize().multiplyScalar(this.speed); //нормалізуємо вектор і множимо на швидкість ворога
    this.zombie.position.set(
      this.zombie.position.x + v.x,
      this.zombie.position.y + v.y 
    ); //оновлюємо позицію ворога
  }

  randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4); //випадкове число 0-3 включно
    let spawnPoint = new Victor(0, 0); //створюємо вектор для координат генерації
    let canvasSize = this.app.screen.width; //отримуємо ширину екрану
    switch (edge) {
      case 0: //верхня сторона
        spawnPoint.x = canvasSize * Math.random(); //x випадкове число від 0 до ширини екрану
        break;
      case 1: //права сторона
        spawnPoint.x = canvasSize; //x дорівнює ширині екрану
        spawnPoint.y = canvasSize * Math.random(); //y випадкове число від 0 до висоти екрану
        break;
      case 2: //нижня сторона
        spawnPoint.x = canvasSize * Math.random(); //x випадкове число від 0 до ширини екрану
        spawnPoint.y = canvasSize; //y дорівнює висоті екрану
        break;
      default: //нижня сторона
        spawnPoint.x = 0; //x дорівнює 0
        spawnPoint.y = canvasSize * Math.random(); //y випадкове число від 0 до висоти екрану
        break;
    }
    return spawnPoint; //повертаємо координати
  }
}
