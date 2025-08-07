import { Navbar } from 'react-bootstrap';
import NavbarBrand from '../nav-items/NavbarBrand';
import DropdownSearchBox from 'components/common/DropdownSearchBox';
import SearchResult from 'components/common/SearchResult';
import NavItems from '../nav-items/NavItems';
import NavbarTopNav from '../navbar-horizontal/NavbarTopNav';
import { useAppContext } from 'providers/AppProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const NavbarDual = ({
  userId,
  userFullName,
  logo
}: {
  userId?: string;
  userFullName?: string;
  logo?: string;
}) => {
  const {
    config: { navbarTopAppearance }
  } = useAppContext();
  const { breakpoints } = useBreakpoints();

  return (
    <Navbar
      className="navbar-top fixed-top"
      expand="lg"
      variant=""
      data-navbar-appearance={navbarTopAppearance === 'darker' ? 'darker' : ''}
    >
      <div className="w-100">
        <div className="d-flex flex-between-center dual-nav-first-layer">
          <div className="navbar-brand-wrapper">
            <NavbarBrand logo={logo} />
          </div>

          {/* <div className="navbar-search-wrapper">
            <DropdownSearchBox
              className="navbar-top-search-box"
              inputClassName="rounded-pill"
              searchBoxClassName="d-none d-lg-block"
              size="sm"
              style={{ width: '25rem', maxWidth: '100%' }}
              placeholder="Ara..."
            >
              <SearchResult />
            </DropdownSearchBox>
          </div> */}

          <div className="navbar-nav-wrapper">
            <NavItems userFullName={userFullName} userId={userId} />
          </div>
        </div>

        <Navbar.Collapse
          className="navbar-top-collapse justify-content-center"
          id="basic-navbar-nav"
        >
          <NavbarTopNav />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavbarDual;
