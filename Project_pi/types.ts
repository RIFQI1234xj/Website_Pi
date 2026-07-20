import React from 'react';

export enum Page {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  PROGRAMS = 'PROGRAMS',
  NEWS = 'NEWS',
  NEWS_DETAIL = 'NEWS_DETAIL',
  GALLERY = 'GALLERY',
  GALLERY_DETAIL = 'GALLERY_DETAIL',
  CONTACT = 'CONTACT',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_NEWS = 'ADMIN_NEWS',
  ADMIN_GALLERY = 'ADMIN_GALLERY',
  ADMIN_TEACHERS = 'ADMIN_TEACHERS',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
  ADMIN_PROGRAMS = 'ADMIN_PROGRAMS',
  ADMIN_PRINCIPAL = 'ADMIN_PRINCIPAL',
  PPDB = 'PPDB',
  PPDB_FORM = 'PPDB_FORM',
  ADMIN_PPDB = 'ADMIN_PPDB',
}

export type PPDBStatus = 'pending' | 'approved' | 'rejected';
export type Gender = 'Laki-laki' | 'Perempuan';

export interface PPDBApplicant {
  id: string;
  tahunAjaran?: string;
  studentName: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender;
  address: string;
  parentName: string;
  whatsappNumber: string;
  kkFileName: string;
  kkFileData: string;
  aktaFileName: string;
  aktaFileData: string;
  ktpFileName: string;
  ktpFileData: string;
  ijazahFileName?: string;
  ijazahFileData?: string;
  status: PPDBStatus;
  submittedAt: string;
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
  is_active?: boolean | number;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}