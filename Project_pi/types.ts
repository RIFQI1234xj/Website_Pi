import React from 'react';

export enum Page {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  PROGRAMS = 'PROGRAMS',
  NEWS = 'NEWS',
  NEWS_DETAIL = 'NEWS_DETAIL',
  GALLERY = 'GALLERY',
  CONTACT = 'CONTACT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_NEWS = 'ADMIN_NEWS',
  ADMIN_GALLERY = 'ADMIN_GALLERY',
  ADMIN_TEACHERS = 'ADMIN_TEACHERS',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
}

export interface NewsItem {
  id: number;
  title: string;
  category: 'Kegiatan' | 'Pengumuman' | 'Prestasi';
  date: string;
  image: string;
  excerpt: string;
  content?: string;
}

export interface Teacher {
  id: number;
  name: string;
  role: string;
  image: string;
  subject?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}