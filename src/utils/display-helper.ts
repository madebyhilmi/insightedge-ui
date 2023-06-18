export class DisplaySize {
  public static alterUiSize() {
    overwolf.utils.getMonitorsList(monitorsInfo => {
      const link = document.getElementById(
        'dynamicStylesheet'
      ) as HTMLLinkElement;
      let primaryDisplayHeight: number;
      for (const display of monitorsInfo.displays) {
        if (display.is_primary) {
          primaryDisplayHeight = display.height;
        }
      }
      if (primaryDisplayHeight === 1080) {
        link.href = '../../css/1080p.css';
      } else if (primaryDisplayHeight === 1440) {
        link.href = '../../css/1440p.css';
      } else if (primaryDisplayHeight === 2160) {
        link.href = '../../css/4k.css';
      }
    });
  }
}
