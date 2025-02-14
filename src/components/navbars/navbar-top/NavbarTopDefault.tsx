import { Navbar } from 'react-bootstrap';
import { useAppContext } from 'providers/AppProvider';
import classNames from 'classnames';
import NavbarBrand from 'components/navbars/nav-items/NavbarBrand';
import NavItems from 'components/navbars/nav-items/NavItems';
import NavItemsSlim from 'components/navbars/nav-items/NavItemsSlim';
import DropdownSearchBox from 'components/common/DropdownSearchBox';
import SearchResult from 'components/common/SearchResult';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const NavbarTopDefault = ({
  userId,
  userFullName,
  logo
}: {
  userId?: string;
  userFullName?: string;
  logo?: string;
}) => {
  const {
    config: { navbarTopShape, navbarTopAppearance }
  } = useAppContext();

  const { breakpoints } = useBreakpoints();

  return (
    <Navbar
      className={classNames('navbar-top fixed-top', {
        'navbar-slim': navbarTopShape === 'slim'
        // 'navbar-darker': navbarTopAppearance === 'darker'
      })}
      expand
      variant=""
      data-navbar-appearance={navbarTopAppearance === 'darker' ? 'darker' : ''}
    >
      <div className="navbar-collapse justify-content-between">
        <NavbarBrand logo={logo} />

        {navbarTopShape === 'default' ? (
          <>
            {breakpoints.up('lg') && (
              <p className="logo-text ms-2 d-none d-sm-block"></p>
            )}
            <NavItems userFullName={userFullName} userId={userId} />
          </>
        ) : (
          <NavItemsSlim />
        )}
      </div>
    </Navbar>
  );
};

export default NavbarTopDefault;
