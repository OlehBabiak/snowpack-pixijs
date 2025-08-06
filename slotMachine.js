import * as PIXI from "pixi.js";

export class SlotMachine {
  constructor(app) {
    this.app = app;
    this.reels = [];
    this.symbols = ["🍒", "🔔", "🍋", "🍊", "⭐️", "7️⃣"];
    this.reelWidth = 150;
    this.symbolSize = 100;
    this.reelHeight = 3; // symbols per reel visible
    this.reelCount = 3;
    this.running = false;
    this.stoppedReels = 0;
  }

  start() {
    this.createReels();
    this.addSpinButton();
  }

  createReels() {
    const spacing = 40;
    const baseX =
      (this.app.screen.width -
        (this.reelCount * this.reelWidth + (this.reelCount - 1) * spacing)) /
      2;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = baseX + i * (this.reelWidth + spacing);
      container.y = 100;
      this.app.stage.addChild(container);

      const maskShape = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(
          0,
          this.symbolSize / 2,
          this.reelWidth,
          this.symbolSize * this.reelHeight
        )
        .endFill();

      maskShape.x = container.x;
      maskShape.y = container.y;
      this.app.stage.addChild(maskShape);
      container.mask = maskShape; 

      const frame = new PIXI.Graphics()
        .lineStyle(4, 0xffd700)
        .drawRect(
          0,
          this.symbolSize / 2,
          this.reelWidth,
          this.symbolSize * this.reelHeight
        );

      frame.x = container.x;
      frame.y = container.y;
      this.app.stage.addChild(frame);

      const reel = {
        container,
        symbols: [],
        position: 0,
        speed: 0,
        targetStop: 0,
        spinning: false,
      };

      for (let j = 0; j < this.reelHeight + 4; j++) {
        const symbol = new PIXI.Text(this.randomSymbol(), {
          fontFamily: "Arial",
          fontSize: 64,
          fill: 0xffffff,
          align: "center",
        });
        symbol.anchor.set(0.5);
        symbol.x = this.reelWidth / 2;
        symbol.y = j * this.symbolSize;
        container.addChild(symbol);
        reel.symbols.push(symbol);
      }

      this.reels.push(reel);
    }

    this.app.ticker.add((delta) => this.updateReels(delta));
  }

  addSpinButton() {
    const container = new PIXI.Container();

    // Створюємо фон кнопки
    const background = new PIXI.Graphics()
      .beginFill(0x3333ff)
      .drawRoundedRect(0, 0, 200, 60, 10)
      .endFill();

    // Створюємо текст
    const button = new PIXI.Text("SPIN", {
      fontFamily: "Arial",
      fontSize: 42,
      fill: ["#ffffff", "#ff9900"], // градієнт
      stroke: "#4a1850",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowDistance: 6,
    });

    // Центруємо текст усередині кнопки
    button.anchor.set(0.5);
    button.x = 100; // половина ширини background (200 / 2)
    button.y = 30; // половина висоти background (60 / 2)

    // Налаштовуємо контейнер як кнопку
    container.interactive = true;
    container.buttonMode = true;
    container.x = this.app.screen.width / 2;
    container.y = this.app.screen.height - 80;
    container.pivot.set(100, 30); // Центрування всього контейнера (200/2, 60/2)

    // Подія кліку
    container.on("pointerdown", () => this.spinReels());

    // Додаємо фон і текст у контейнер
    container.addChild(background, button);

    // Додаємо на сцену
    this.app.stage.addChild(container);
  }

  spinReels() {
    if (this.running) return;
    this.running = true;
    this.stoppedReels = 0;

    for (let i = 0; i < this.reels.length; i++) {
      const reel = this.reels[i];
      reel.speed = 0.5 + i * 0.15;
      reel.spinning = true;

      setTimeout(() => {
        reel.targetStop = Math.floor(Math.random() * this.symbols.length);
        reel.stopping = true;
      }, 1000 + i * 600);
    }
  }

checkWin() {
  let winAmount = 0;
  const winningLines = [];

  const payLines = {
    top: this.reels.map((reel) => reel.symbols[1].text),
    middle: this.reels.map((reel) => reel.symbols[2].text),
    bottom: this.reels.map((reel) => reel.symbols[3].text),
    diagonalDown: this.reels.map((reel, i) => reel.symbols[1 + i]?.text),
    diagonalUp: this.reels.map((reel, i) => reel.symbols[3 - i]?.text),
  };

  Object.entries(payLines).forEach(([payLine, symbols]) => {
    const allEqual = symbols.every((sym) => sym === symbols[0]);
    if (!allEqual) return;

    switch (payLine) {
      case "top":
        winAmount += 100;
        winningLines.push("Верхня лінія");
        break;
      case "middle":
        winAmount += 300;
        winningLines.push("Середня лінія");
        break;
      case "bottom":
        winAmount += 100;
        winningLines.push("Нижня лінія");
        break;
      case "diagonalDown":
        winAmount += 50;
        winningLines.push("Діагональ ↘");
        break;
      case "diagonalUp":
        winAmount += 50;
        winningLines.push("Діагональ ↗");
        break;
    }
  });

  let messageText;
  if (winAmount > 0) {
    messageText = `WIN ${winAmount}$!\n(${winningLines.join(", ")})`;
  } else {
    messageText = "TRY AGAIN";
  }

  const message = new PIXI.Text(messageText, {
    fontFamily: "Arial",
    fontSize: 42,
    fill: winAmount > 0 ? 0x00ff00 : 0xff5555,
    align: "center",
  });

  message.anchor.set(0.5);
  message.x = this.app.screen.width / 2;
  message.y = 40;
  this.app.stage.addChild(message);

  setTimeout(() => this.app.stage.removeChild(message), 5500);
}


  updateReels(delta) {
    for (const reel of this.reels) {
      if (!reel.spinning) continue;

      reel.position += reel.speed * delta;
      if (reel.position >= 1) {
        reel.position = 0;

        // scroll symbols
        const first = reel.symbols.shift();
        first.text = this.randomSymbol();
        first.y = reel.symbols[reel.symbols.length - 1].y + this.symbolSize;
        reel.symbols.push(first);
      }

      // update symbol positions
      for (let i = 0; i < reel.symbols.length; i++) {
        reel.symbols[i].y =
          i * this.symbolSize - reel.position * this.symbolSize;
      }

      // stop condition
      if (reel.stopping && reel.speed > 0.05) {
        reel.speed *= 0.95;
      } else if (reel.stopping) {
        reel.spinning = false;
        reel.stopping = false;
        reel.speed = 0;

        // ВИРІВНЮЄМО символи точно по позиціях
        reel.position = 0;
        for (let i = 0; i < reel.symbols.length; i++) {
          reel.symbols[i].y = i * this.symbolSize;
        }

        this.stoppedReels++;
        if (this.stoppedReels === this.reels.length) {
          this.running = false;
          this.checkWin(); // викликаємо перевірку виграшу
        }
      }
    }
  }

  randomSymbol() {
    const index = Math.floor(Math.random() * this.symbols.length);
    return this.symbols[index];
  }
}
