import webHome from '../../public/img/webHome.png';
import mobileHome from '../../public/img/mobileHome.png';
import iosOpenScreen from '../../public/img/iosOpenScreen.jpg';
import iosLiveMatch from '../../public/img/iosLiveMatch.jpg';
import iosLiveBottom from '../../public/img/iosLiveBottom.jpg';
import iosMatchChatTab from '../../public/img/iosMatchChatTab.jpg';
import iosMatchOverviewTab from '../../public/img/iosMatchOverviewTab.jpg';
import iosMatchOverviewBottom from '../../public/img/iosMatchOverviewBottom.jpg';
import iosMatchOddsBottom from '../../public/img/iosMatchOddsBottom.jpg';
import androidSidebarBottom from '../../public/img/androidSidebarBottom.jpeg';

enum PlatformEnum {
  web = 'web',
  mobile = 'mobile',
  ios = 'ios',
  android = 'android',
}

export const PlatformList = [
  {
    value: PlatformEnum.web,
    label: 'pc web',
  },
  {
    value: PlatformEnum.mobile,
    label: 'mobile web',
  },
  {
    value: PlatformEnum.ios,
    label: 'ios app',
  },
  {
    value: PlatformEnum.android,
    label: 'android app',
  },
];

interface AdImageInfo {
  [platform: string]: {
    [position: string]: {
      demoImg: string;
      width: number;
      height: number;
    };
  };
}

export const AdImageInfoMaps: AdImageInfo = {
  [PlatformEnum.web]: {
    homepage: {
      demoImg: webHome,
      width: 992,
      height: 100,
    },
    topBanner: {
      demoImg: webHome,
      width: 1200,
      height: 90,
    },
    sideBanner: {
      demoImg: webHome,
      width: 200,
      height: 200,
    },
  },
  [PlatformEnum.mobile]: {
    liveTop: {
      demoImg: mobileHome,
      width: 750,
      height: 88,
    },

    matchPageBottom: {
      demoImg: mobileHome,
      width: 750,
      height: 88,
    },
  },
  [PlatformEnum.ios]: {
    openScreen: {
      demoImg: iosOpenScreen,
      width: 750,
      height: 1160,
    },
    liveMatch: {
      demoImg: iosLiveMatch,
      width: 750,
      height: 100,
    },
    liveBottom: {
      demoImg: iosLiveBottom,
      width: 750,
      height: 100,
    },
    matchOverviewTab: {
      demoImg: iosMatchOverviewTab,
      width: 750,
      height: 56,
    },
    matchOverviewBottom: {
      demoImg: iosMatchOverviewBottom,
      width: 750,
      height: 88,
    },
    matchChatTab: {
      demoImg: iosMatchChatTab,
      width: 750,
      height: 88,
    },
    matchOddsBottom: {
      demoImg: iosMatchOddsBottom,
      width: 750,
      height: 88,
    },
    sidebarBottom: {
      demoImg: androidSidebarBottom,
      width: 512,
      height: 56,
    },
  },
  [PlatformEnum.android]: {
    openScreen: {
      demoImg: iosOpenScreen,
      width: 750,
      height: 1160,
    },
    liveMatch: {
      demoImg: iosLiveMatch,
      width: 750,
      height: 100,
    },
    liveBottom: {
      demoImg: iosLiveBottom,
      width: 750,
      height: 100,
    },
    matchOverviewTab: {
      demoImg: iosMatchOverviewTab,
      width: 750,
      height: 56,
    },
    matchOverviewBottom: {
      demoImg: iosMatchOverviewBottom,
      width: 750,
      height: 88,
    },
    matchChatTab: {
      demoImg: iosMatchChatTab,
      width: 750,
      height: 88,
    },
    matchOddsBottom: {
      demoImg: iosMatchOddsBottom,
      width: 750,
      height: 88,
    },
    sidebarBottom: {
      demoImg: androidSidebarBottom,
      width: 512,
      height: 56,
    },
  },
};

export const CreateErrorMessage: any = {
  imageUrl: 'Please input your AD Image Url!',
  width: 'Please input your AD Width!',
  height: 'Please input your AD Height!',
  title: 'Please input your AD Title!',
};
