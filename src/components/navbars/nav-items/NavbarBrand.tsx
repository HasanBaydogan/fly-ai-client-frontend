import classNames from 'classnames';
import { useAppContext } from 'providers/AppProvider';
import { Navbar } from 'react-bootstrap';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import NavbarToggleButton from './NavbarToggleButton';
import { useUnsavedChanges } from 'providers/UnsavedChangesProvider';
import defaultLogo from 'assets/img/icons/FlyAI-Logo.png';
import { useState } from 'react';

const NavbarBrand = ({ logo }: { logo?: string }) => {
  const {
    config: { navbarTopShape, navbarPosition }
  } = useAppContext();
  const { breakpoints } = useBreakpoints();
  const { navigateSafely } = useUnsavedChanges();
  const [imageError, setImageError] = useState(false);

  // Logo prop'u yoksa varsayılan logo kullan
  const logoSrc = logo || defaultLogo;

  // Custom navigation handler for the logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateSafely('/pi/list');
  };

  const handleImageError = () => {
    console.error('Logo does not loading:', logoSrc);
    setImageError(true);
  };

  return (
    <>
      <div className="navbar-logo">
        {breakpoints.down('lg') && <NavbarToggleButton />}
        <Navbar.Brand
          as="a"
          href="/pi/list"
          onClick={handleLogoClick}
          className={classNames({
            'me-1 me-sm-3':
              navbarTopShape === 'slim' || navbarPosition === 'horizontal'
          })}
        >
          {navbarTopShape === 'slim' ? (
            <>
              FLY AI{' '}
              <span className="text-body-highlight d-none d-sm-inline">
                slim
              </span>
            </>
          ) : (
            <div className="d-flex align-items-center ms-2">
              {!imageError ? (
                <img
                  src={logoSrc}
                  alt="FlyAI"
                  className="navbar-logo-img my-2"
                  style={{
                    objectFit: 'contain',
                    maxHeight: '50px',
                    width: 'auto'
                  }}
                  onError={handleImageError}
                />
              ) : (
                <div className="navbar-logo-fallback my-2">
                  <span className="fw-bold text-primary">FlyAI</span>
                </div>
              )}
              <p className="logo-text ms-2 d-none d-sm-block"></p>
            </div>
          )}
          <div className="small fs-10 text-center  text-muted">
            {/* v1.13.26-23.06.25 */}
          </div>
        </Navbar.Brand>
      </div>
    </>
  );
};

export default NavbarBrand;
