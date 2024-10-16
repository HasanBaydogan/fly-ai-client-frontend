import { Outlet } from 'react-router-dom';
import useSettingsMountEffect from 'hooks/useSettingsMountEffect';
import ChatWidget from 'components/common/chat-widget/ChatWidget';
import TopNav from 'pages/apps/travel-agency/landing/TopNav';
import NavbarMain from 'components/navbars/travel-agency/NavbarMain';
import TravelFooter from 'components/footers/TravelFooter';
import Footer from 'components/footers/Footer';

const TravelAgencyLayout = () => {
  useSettingsMountEffect({
    disableNavigationType: true,
    disableHorizontalNavbarAppearance: true,
    disableVerticalNavbarAppearance: true,
    disableHorizontalNavbarShape: true
  });
  return (
    <>
      <TopNav />
      <NavbarMain />
      <Outlet />
      <TravelFooter />
      <Footer />
      <ChatWidget />
    </>
  );
};

export default TravelAgencyLayout;
