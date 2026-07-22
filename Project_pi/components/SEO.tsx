import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Website Resmi MI Al-Hasani Cisarua Bogor. Cerdas, Berkarakter, Islami.",
  keywords = "MI Al-Hasani, Madrasah Ibtidaiyah, Cisarua, Bogor, Sekolah Islam, PPDB"
}) => {
  return (
    <Helmet>
      <title>{title} | MI Al-Hasani</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};
