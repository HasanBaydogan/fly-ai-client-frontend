import useSettingsMountEffect from 'hooks/useSettingsMountEffect';
import React from 'react';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import { defaultBreadcrumbItems } from 'data/commonData';
import GalleryItems from 'components/modules/travel-agency/dashboard/hotel/GalleryItems';
import { galleryItems } from 'data/travel-agency/customer/gallery';

const HotelGallery = () => {
  useSettingsMountEffect({
    disableNavigationType: true,
    disableHorizontalNavbarAppearance: true,
    disableVerticalNavbarAppearance: true,
    disableHorizontalNavbarShape: true
  });

  return (
    <>
      <section className="pt-6 pb-9">
        <div className="container-medium">
          <PageBreadcrumb items={defaultBreadcrumbItems} className="mb-3" />
          <h2 className="mb-5">Gallery</h2>
          <GalleryItems galleryItems={galleryItems} />
        </div>
      </section>
    </>
  );
};

export default HotelGallery;
