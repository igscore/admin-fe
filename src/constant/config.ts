import webHome from '../../public/img/webHome.png';
import mobileHome from '../../public/img/mobileHome.png';
import appLive from '../../public/img/iosLive.png';

export const LanguageList = [
  {
    value: 'aze',
    index: 37,
    label: 'Azərbaycan dili',
    locale: 'az',
  },
  {
    value: 'bs',
    index: 30,
    label: 'Bosanski',
    locale: 'bs',
  },
  {
    value: 'index',
    index: 34,
    label: 'Bahasa Indonesia',
    locale: 'index',
  },
  {
    value: 'sr',
    index: 31,
    label: 'Cрпски',
    locale: 'sr',
  },
  {
    value: 'de',
    index: 7,
    label: 'Deutsch',
    locale: 'de',
  },
  {
    value: 'da',
    index: 11,
    label: 'Dansk',
    locale: 'da',
  },
  {
    value: 'en',
    index: 2,
    label: 'English',
    locale: 'en',
  },
  {
    value: 'es',
    index: 4,
    label: 'Español',
    locale: 'es',
  },
  {
    value: 'et',
    index: 22,
    label: 'Eesti',
    locale: 'et',
  },
  {
    value: 'fr',
    index: 6,
    label: 'Français',
    locale: 'fr',
  },
  {
    value: 'hr',
    index: 25,
    label: 'Hrvatski',
    locale: 'hr',
  },
  {
    value: 'it',
    index: 8,
    label: 'Italiano',
    locale: 'it',
  },
  {
    value: 'lv',
    index: 27,
    label: 'Latviešu',
    locale: 'lv',
  },
  {
    value: 'lt',
    index: 33,
    label: 'Lietuvių',
    locale: 'lt',
  },
  {
    value: 'hu',
    index: 19,
    label: 'Magyar',
    locale: 'hu',
  },
  {
    value: 'nn',
    index: 13,
    label: 'Norsk',
    locale: 'nn',
  },
  {
    value: 'nl',
    index: 21,
    label: 'Nederlands',
    locale: 'nl',
  },
  {
    value: 'pt',
    index: 5,
    label: 'Português',
    locale: 'pt',
  },
  {
    value: 'ru',
    index: 9,
    label: 'Pусский',
    locale: 'ru',
  },
  {
    value: 'pl',
    index: 16,
    label: 'Polski',
    locale: 'pl',
  },
  {
    value: 'br',
    index: 43,
    label: 'Português do Brasil',
    locale: 'pt-br',
  },
  {
    value: 'ro',
    index: 17,
    label: 'Română',
    locale: 'ro',
  },
  {
    value: 'sv',
    index: 12,
    label: 'Svenska',
    locale: 'sv',
  },
  {
    value: 'sk',
    index: 20,
    label: 'Slovenčina',
    locale: 'sk',
  },
  {
    value: 'sl',
    index: 26,
    label: 'Slovenščina',
    locale: 'sl',
  },
  {
    value: 'fi',
    index: 28,
    label: 'Suomeksi',
    locale: 'fi',
  },
  {
    value: 'sqi',
    index: 39,
    label: 'Shqip',
    locale: 'sq',
  },
  {
    value: 'tr',
    index: 24,
    label: 'Türkçe',
    locale: 'tr',
  },
  {
    value: 'vi',
    index: 35,
    label: 'Tiếng Việt',
    locale: 'vi',
  },
  {
    value: 'cs',
    index: 18,
    label: 'Česky',
    locale: 'cs',
  },
  {
    value: 'el',
    index: 15,
    label: 'Ελληνικά',
    locale: 'el',
  },
  {
    value: 'bg',
    index: 14,
    label: 'Български',
    locale: 'bg',
  },
  {
    value: 'mk',
    index: 32,
    label: 'Македонски',
    locale: 'mk',
  },
  {
    value: 'ukr',
    index: 40,
    label: 'Українська',
    locale: 'uk',
  },
  {
    value: 'aa',
    index: 36,
    label: 'العربية',
    locale: 'ar-sa',
  },
  {
    value: 'th',
    index: 29,
    label: 'ไทย',
    locale: 'th',
  },
  {
    value: 'mm',
    index: 41,
    label: 'မြန်မာဘာသာ',
    locale: 'my',
  },
  {
    value: 'ka',
    index: 38,
    label: 'ქართული',
    locale: 'ka',
  },
  {
    value: 'km',
    index: 45,
    label: 'ភាសាខ្មែរ',
    locale: 'km',
  },
  {
    value: 'zht',
    index: 3,
    label: '中文繁體',
    locale: 'zh-tw',
  },
  {
    value: 'ja',
    index: 10,
    label: '日本語',
    locale: 'ja',
  },
  {
    value: 'ko',
    index: 23,
    label: '한국어',
    locale: 'ko',
  },
];

export const GlobalSportPathname = [
  'football',
  'basketball',
  'amfootball',
  'baseball',
  'icehockey',
  'tennis',
  'volleyball',
  'esports',
  'handball',
  'cricket',
  'waterpolo',
  'tabletennis',
  'snooker',
  'badminton',
];

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
    liveMatch: {
      demoImg: mobileHome,
      width: 750,
      height: 88,
    },
    matchPage: {
      demoImg: mobileHome,
      width: 750,
      height: 88,
    },
  },
  [PlatformEnum.ios]: {
    openScreen: {
      demoImg: appLive,
      width: 750,
      height: 1160,
    },
    liveMatch: {
      demoImg: appLive,
      width: 750,
      height: 100,
    },
    liveBottom: {
      demoImg: appLive,
      width: 750,
      height: 100,
    },
    matchChatTab: {
      demoImg: appLive,
      width: 750,
      height: 88,
    },
    matchOddsBottom: {
      demoImg: appLive,
      width: 750,
      height: 88,
    },
    matchOverviewTab: {
      demoImg: appLive,
      width: 750,
      height: 56,
    },
    sidebarBottom: {
      demoImg: appLive,
      width: 512,
      height: 56,
    },
  },
  [PlatformEnum.android]: {
    openScreen: {
      demoImg: appLive,
      width: 750,
      height: 1160,
    },
    liveMatch: {
      demoImg: appLive,
      width: 750,
      height: 100,
    },
    liveBottom: {
      demoImg: appLive,
      width: 750,
      height: 100,
    },
    matchChatTab: {
      demoImg: appLive,
      width: 750,
      height: 88,
    },
    matchOddsBottom: {
      demoImg: appLive,
      width: 750,
      height: 88,
    },
    matchOverviewTab: {
      demoImg: appLive,
      width: 750,
      height: 56,
    },
    sidebarBottom: {
      demoImg: appLive,
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
