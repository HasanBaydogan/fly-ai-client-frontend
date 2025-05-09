import classNames from 'classnames';
import { useAppContext } from 'providers/AppProvider';
import { Navbar } from 'react-bootstrap';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import NavbarToggleButton from './NavbarToggleButton';
import { Link } from 'react-router-dom';
import { useUnsavedChanges } from 'providers/UnsavedChangesProvider';

const NavbarBrand = ({ logo }: { logo?: string }) => {
  const {
    config: { navbarTopShape, navbarPosition }
  } = useAppContext();
  const { breakpoints } = useBreakpoints();
  const { navigateSafely } = useUnsavedChanges();

  // Custom navigation handler for the logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateSafely('/');
  };

  return (
    <>
      <div className="navbar-logo">
        {breakpoints.down('lg') && <NavbarToggleButton />}
        <Navbar.Brand
          as="a"
          href="/"
          onClick={handleLogoClick}
          className={classNames({
            'me-1 me-sm-3':
              navbarTopShape === 'slim' || navbarPosition === 'horizontal'
          })}
        >
          {navbarTopShape === 'slim' ? (
            <>
              phoenix{' '}
              <span className="text-body-highlight d-none d-sm-inline">
                slim
              </span>
            </>
          ) : (
            <div className="d-flex align-items-center ms-2">
              <img src={logo} alt="asparel1" width={100} className="mt-2" />
              <p className="logo-text ms-2 d-none d-sm-block"></p>
            </div>
          )}
          <div className="small fs-10 text-center  text-muted">
            v1.11.6-09.05.25
          </div>
        </Navbar.Brand>
      </div>
    </>
  );
};

export default NavbarBrand;
