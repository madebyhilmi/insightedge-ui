import { OWGames, OWGamesEvents } from '@overwolf/overwolf-api-ts';

import {
  kHotkeys,
  kWindowNames,
  kGamesFeatures,
} from '../config/overwolf-constants';

import WindowState = overwolf.windows.WindowStateEx;
import { InGameWindow } from '../in-game-window';
import { Constants } from '../config/constants';
import { DisplaySize } from '../config/display_callback';

// The window displayed in-game while a game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up 'Tab' as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends InGameWindow {
  private static _instance: InGame;
  private _gameEventsListener: OWGamesEvents;
  private _teamTotalGold: HTMLElement;

  private constructor() {
    super(kWindowNames.inGame);
    this.handleTabHold = this.handleTabHold.bind(this);
    this._teamTotalGold = document.getElementById('allied-gold');
    overwolf.settings.hotkeys.onHold.addListener(this.handleTabHold);
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public async run() {
    const gameClassId = await this.getCurrentGameClassId();

    const gameFeatures = kGamesFeatures.get(gameClassId);

    if (gameFeatures && gameFeatures.length) {
      this._gameEventsListener = new OWGamesEvents(
        {
          onInfoUpdates: this.onInfoUpdates.bind(this),
          onNewEvents: this.onNewEvents.bind(this),
        },
        gameFeatures
      );

      this._gameEventsListener.start();
    }
  }

  private onInfoUpdates(info) {
    console.log(info);
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    const shouldHighlight = e.events.some(event => {
      switch (event.name) {
        case 'kill':
        case 'death':
        case 'assist':
        case 'level':
        case 'matchStart':
        case 'match_start':
        case 'matchEnd':
        case 'match_end':
          return true;
      }

      return false;
    });
  }

  // Sets handleTabHold to when 'Tab' is in the state 'down' the overlay is displayed
  private async handleTabHold(hotkeyEvent) {
    const inGameState = await this.currWindow.getWindowState();
    const windowSize = DisplaySize.instance();
    if (hotkeyEvent.name === kHotkeys.toggle) {
      if (
        hotkeyEvent.state === Constants.down &&
        (inGameState.window_state === WindowState.MINIMIZED ||
          inGameState.window_state === WindowState.CLOSED)
      ) {
        const randomNumber = Math.floor(Math.random() * 6000) + 500;
        this._teamTotalGold.textContent = `${randomNumber}G`;
        this.currWindow.maximize();
      } else if (
        hotkeyEvent.state === Constants.up &&
        (inGameState.window_state === WindowState.NORMAL ||
          inGameState.window_state === WindowState.MAXIMIZED)
      ) {
        this.currWindow.minimize();
      }
    }
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    // Check if scroll is near bottom
    const shouldAutoScroll =
      log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private async getCurrentGameClassId(): Promise<number | null> {
    const info = await OWGames.getRunningGameInfo();

    return info && info.isRunning && info.classId ? info.classId : null;
  }
}

InGame.instance().run();
