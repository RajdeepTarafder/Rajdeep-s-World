import React from 'react';

interface ZoneBannerProps {
  title: string;
  desc: string;
  visible: boolean;
}

export const ZoneBanner: React.FC<ZoneBannerProps> = ({ title, desc, visible }) => {
  if (!visible) return null;

  return (
    <div className="zone-banner">
      <div className="zone-banner-border">
        <div className="zone-banner-subtitle">SECTOR ENTERED</div>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
};
