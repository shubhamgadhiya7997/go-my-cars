import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return <h1 className="p-4 text-3xl font-semibold">{title}</h1>;
};

export default PageTitle;
