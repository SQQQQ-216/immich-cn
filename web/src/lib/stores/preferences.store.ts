import { browser } from '$app/environment';
import { Theme } from '$lib/constants';
import { persisted } from 'svelte-local-storage-store';
import { get } from 'svelte/store';

export interface ThemeSetting {
  value: Theme;
  system: boolean;
}

export const handleToggleTheme = () => {
  const theme = get(colorTheme);
  theme.value = theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  colorTheme.set(theme);
};

const initTheme = (): ThemeSetting => {
  if (browser && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return { value: Theme.LIGHT, system: false };
  }
  return { value: Theme.DARK, system: false };
};

const initialTheme = initTheme();

// The 'color-theme' key is also used by app.html to prevent FOUC on page load.
export const colorTheme = persisted<ThemeSetting>('color-theme', initialTheme, {
  serializer: {
    parse: (text: string): ThemeSetting => {
      const parsedText: ThemeSetting = JSON.parse(text);
      return Object.values(Theme).includes(parsedText.value) ? parsedText : initTheme();
    },
    stringify: (object) => JSON.stringify(object),
  },
});

// Locale to use for formatting dates, numbers, etc.
export const locale = persisted<string | undefined>('locale', undefined, {
  serializer: {
    parse: (text) => text,
    stringify: (object) => object ?? '',
  },
});

export interface MapSettings {
  allowDarkMode: boolean;
  includeArchived: boolean;
  onlyFavorites: boolean;
  withPartners: boolean;
  relativeDate: string;
  dateAfter: string;
  dateBefore: string;
}

export const mapSettings = persisted<MapSettings>('map-settings', {
  allowDarkMode: true,
  includeArchived: false,
  onlyFavorites: false,
  withPartners: false,
  relativeDate: '',
  dateAfter: '',
  dateBefore: '',
});

export const videoViewerVolume = persisted<number>('video-viewer-volume', 1, {});

export const isShowDetail = persisted<boolean>('info-opened', false, {});

export interface AlbumViewSettings {
  view: string;
  filter: string;
  groupBy: string;
  groupOrder: string;
  sortBy: string;
  sortOrder: string;
  collapsedGroups: {
    // Grouping Option => Array<Group ID>
    [group: string]: string[];
  };
}

export interface SidebarSettings {
  people: boolean;
  sharing: boolean;
}

export const sidebarSettings = persisted<SidebarSettings>('sidebar-settings-1', {
  people: false,
  sharing: true,
});

export enum SortOrder {
  Asc = '升序',
  Desc = '降序',
}

export enum AlbumViewMode {
  Cover = '封面',
  List = '列表',
}

export enum AlbumFilter {
  All = '所有',
  Owned = '本人',
  Shared = '共享',
}

export enum AlbumGroupBy {
  None = '不分类',
  Year = '按年分类',
  Owner = '按拥有者分类',
}

export enum AlbumSortBy {
  Title = '标题',
  ItemCount = '项目数量',
  DateModified = '修改日期',
  DateCreated = '创建日期',
  MostRecentPhoto = '最新的照片',
  OldestPhoto = '最老的照片',
}

export const albumViewSettings = persisted<AlbumViewSettings>('album-view-settings', {
  view: AlbumViewMode.Cover,
  filter: AlbumFilter.All,
  groupBy: AlbumGroupBy.Year,
  groupOrder: SortOrder.Desc,
  sortBy: AlbumSortBy.MostRecentPhoto,
  sortOrder: SortOrder.Desc,
  collapsedGroups: {},
});

export const showDeleteModal = persisted<boolean>('delete-confirm-dialog', true, {});

export const alwaysLoadOriginalFile = persisted<boolean>('always-load-original-file', false, {});

export const playVideoThumbnailOnHover = persisted<boolean>('play-video-thumbnail-on-hover', true, {});
