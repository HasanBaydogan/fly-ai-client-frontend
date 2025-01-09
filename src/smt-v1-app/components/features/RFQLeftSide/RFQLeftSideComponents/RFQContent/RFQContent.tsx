import React from 'react';

const RFQContent = ({ content }: { content: string }) => {
  return (
    <div
      className="rfq-mail-detail-content"
      style={{
        maxWidth: '460px',

        overflowY: 'auto', // Yüksekliği aşan içerik için dikey kaydırma ekler
        overflowX: 'auto' // Yatay kaydırmayı gizler
      }}
      dangerouslySetInnerHTML={{
        __html: `${content}`
      }}
    ></div>
  );
};

export default RFQContent;
