export type Language = 'TR' | 'EN';

export interface ContentSection {
  title: string;
  subtitle?: string;
  body: string | string[];
  items?: { title: string; desc: string }[];
  stats?: { label: string; value: string }[];
  videoUrl?: string;
}

export interface PortfolioItem {
  name: string;
  url: string;
}

export interface ContentData {
  hero: {
    name: string;
    role: string;
    reportTitle: string;
  };
  intro: {
    welcome: string;
    advisory: string;
    button: string;
  };
  executive: ContentSection;
  portfolio: {
    title: string;
    webTitle: string;
    appTitle: string;
    websites: string[];
    apps: PortfolioItem[];
  };
  uxui: ContentSection;
  visual: ContentSection;
  multimedia: ContentSection;
  conclusion: ContentSection;
  ui: {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    scroll: string;
  };
  game: {
    startTitle: string;
    startDesc: string;
    mobileInstruction: string;
    desktopInstruction: string;
    gameOver: string;
    tryAgain: string;
    score: string;
    winTitle: string;
    winDesc: string;
    claimBtn: string;
    waMessage: string;
  }
}