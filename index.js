import * as PIXI from 'pixi.js';
import { SlotMachine } from './slotMachine.js';

const app = new PIXI.Application({
  width: 600,
  height: 600,
  backgroundColor: 0x222222,
});
document.body.appendChild(app.view);

const slot = new SlotMachine(app);
slot.start();
