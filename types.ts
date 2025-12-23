
export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  country: string;
  language: string;
}

export enum Category {
  ALL = 'All',
  TELIDRAMA = 'Telidrama',
  KIDS = 'Kids',
  MOVIES = 'Movies',
  NEWS = 'News',
  SPORTS = 'Sports',
  ADULT = 'Adults',
  INTERNATIONAL = 'International',
  POPULAR = 'Popular'
}

export interface AppState {
  channels: Channel[];
  loading: boolean;
  error: string | null;
  selectedChannel: Channel | null;
  favorites: string[];
  adultEnabled: boolean;
}
