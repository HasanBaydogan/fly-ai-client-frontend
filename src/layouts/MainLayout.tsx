import classNames from 'classnames';
import ChatWidget from 'components/common/chat-widget/ChatWidget';
import Footer from 'components/footers/Footer';
import NavbarDual from 'components/navbars/navbar-dual/NavbarDual';
import NavbarTopHorizontal from 'components/navbars/navbar-horizontal/NavbarTopHorizontal';
import NavbarTopDefault from 'components/navbars/navbar-top/NavbarTopDefault';
import NavbarVertical from 'components/navbars/navbar-vertical/NavbarVertical';
import { useAppContext } from 'providers/AppProvider';
import { useMainLayoutContext } from 'providers/MainLayoutProvider';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getUserInfo } from 'smt-v1-app/services/UserService';
// import { useHeartbeat } from 'smt-v1-app/hooks/useHeartbeat';

interface UserNavbarInfo {
  logo: string;
  userFullName: string;
  userId: string;
}

const MainLayout = () => {
  const {
    config: { navbarPosition }
  } = useAppContext();

  const [userInfos, setUserInfos] = useState<UserNavbarInfo>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUserInfoFromDB = async () => {
      setIsLoading(true);
      const response = await getUserInfo();
      setUserInfos(response.data);
      // console.log(response);
      setIsLoading(false);
    };
    getUserInfoFromDB();
  }, []);

  // useHeartbeat();

  const { contentClass, footerClass } = useMainLayoutContext();

  // Navbar render fonksiyonu
  const renderNavbar = () => {
    switch (navbarPosition) {
      case 'vertical':
        return <NavbarVertical />;
      case 'horizontal':
        return <NavbarTopHorizontal />;
      case 'combo':
        return (
          <>
            <NavbarTopHorizontal />
            <NavbarVertical />
          </>
        );
      case 'dual':
        if (isLoading) {
          return (
            <div className="">
              <LoadingAnimation />
            </div>
          );
        }
        return (
          <NavbarDual
            userId={userInfos?.userId}
            userFullName={userInfos?.userFullName}
            logo={userInfos?.logo}
          />
        );
      default:
        return <NavbarVertical />;
    }
  };

  return (
    <Container fluid className="px-0">
      {renderNavbar()}

      <div className={classNames(contentClass, 'content')}>
        <Outlet />
        {/* <Footer className={classNames(footerClass, 'position-absolute')} /> */}
        {/* <ChatWidget /> */}
      </div>
    </Container>
  );
};

export default MainLayout;
