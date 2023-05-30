import { OWWindow } from '@overwolf/overwolf-api-ts';

export class InGameWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);
    console.log(`inGameWindow.construction = ${this.currWindow}`);
  }
}
