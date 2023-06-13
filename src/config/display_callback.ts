import { OWGames, OWGamesEvents } from '@overwolf/overwolf-api-ts';
import relaunch = overwolf.extensions.relaunch;

export class DisplaySize {
  public static instance() {
    overwolf.utils.getMonitorsList(monitorsInfo => {
      console.log(monitorsInfo);
      const link = document.getElementById(
        'dynamicStylesheet'
      ) as HTMLLinkElement;
      const primaryDisplayList: any = [];
      for (const display of monitorsInfo.displays) {
        console.log(display);
        if (display.is_primary) {
          primaryDisplayList.push(display);
        }
      }
      const monitor = primaryDisplayList[0];
      const width = monitor.width;
      const height = monitor.height;
      const displaySize = {
        width: width,
        height: height,
      };
      if (displaySize.width === 1920 && displaySize.height === 1080) {
        link.href = '../../css/1080p.css';
        console.log('1080p');
      } else if (displaySize.width === 2560 && displaySize.height === 1440) {
        link.href = '../../css/1440p.css';
        console.log('1440p');
      } else if (displaySize.width === 3840 && displaySize.height === 2160) {
        link.href = '../../css/4k.css';
        console.log('4k');
      }
    });
  }
}
