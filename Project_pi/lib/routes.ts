import { Page } from '../types';

export const PAGE_PATHS: Record<Page, string> = {
  [Page.HOME]: '/',
  [Page.PROFILE]: '/profil',
  [Page.PROGRAMS]: '/program',
  [Page.NEWS]: '/berita',
  [Page.NEWS_DETAIL]: '/berita/:newsId',
  [Page.GALLERY]: '/galeri',
  [Page.GALLERY_DETAIL]: '/galeri/:galleryId',
  [Page.CONTACT]: '/kontak',
  [Page.ADMIN_LOGIN]: '/admin/login',
  [Page.ADMIN_DASHBOARD]: '/admin',
  [Page.ADMIN_NEWS]: '/admin/news',
  [Page.ADMIN_GALLERY]: '/admin/gallery',
  [Page.ADMIN_TEACHERS]: '/admin/teachers',
  [Page.ADMIN_SETTINGS]: '/admin/settings',
  [Page.ADMIN_PROGRAMS]: '/admin/programs',
  [Page.ADMIN_PRINCIPAL]: '/admin/principal',
  [Page.PPDB]: '/ppdb',
  [Page.PPDB_FORM]: '/ppdb/daftar',
  [Page.ADMIN_PPDB]: '/admin/ppdb',
};

export const DEFAULT_PROFILE_TAB = 'identitas';

export const getNewsDetailPath = (newsId: number | string) => `${PAGE_PATHS[Page.NEWS]}/${newsId}`;

export const getProfilePath = (tab: string = DEFAULT_PROFILE_TAB) =>
  tab === DEFAULT_PROFILE_TAB ? PAGE_PATHS[Page.PROFILE] : `${PAGE_PATHS[Page.PROFILE]}#${tab}`;

export const getPagePath = (page: Page) => PAGE_PATHS[page];

export const getPageFromPathname = (pathname: string): Page => {
  if (pathname === PAGE_PATHS[Page.ADMIN_LOGIN]) return Page.ADMIN_LOGIN;
  if (pathname === PAGE_PATHS[Page.ADMIN_DASHBOARD]) return Page.ADMIN_DASHBOARD;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_NEWS])) return Page.ADMIN_NEWS;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_GALLERY])) return Page.ADMIN_GALLERY;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_TEACHERS])) return Page.ADMIN_TEACHERS;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_SETTINGS])) return Page.ADMIN_SETTINGS;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_PROGRAMS])) return Page.ADMIN_PROGRAMS;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_PRINCIPAL])) return Page.ADMIN_PRINCIPAL;
  if (pathname.startsWith(PAGE_PATHS[Page.ADMIN_PPDB])) return Page.ADMIN_PPDB;
  if (pathname === PAGE_PATHS[Page.PPDB_FORM]) return Page.PPDB_FORM;
  if (pathname === PAGE_PATHS[Page.PPDB]) return Page.PPDB;
  if (pathname === PAGE_PATHS[Page.PROFILE]) return Page.PROFILE;
  if (pathname === PAGE_PATHS[Page.PROGRAMS]) return Page.PROGRAMS;
  if (pathname === PAGE_PATHS[Page.CONTACT]) return Page.CONTACT;
  if (pathname === PAGE_PATHS[Page.NEWS] || pathname.startsWith(`${PAGE_PATHS[Page.NEWS]}/`)) return Page.NEWS;
  if (pathname === PAGE_PATHS[Page.GALLERY] || pathname.startsWith(`${PAGE_PATHS[Page.GALLERY]}/`)) return Page.GALLERY;
  return Page.HOME;
};
