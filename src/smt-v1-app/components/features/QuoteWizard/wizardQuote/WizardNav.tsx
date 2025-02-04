import {
  faCheck,
  faFileAlt,
  faLock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import WizardNavItem from './WizardNavItem';

const WizardNav = () => {
  return (
    <Nav className="justify-content-between nav-wizard nav-wizard-success">
      <WizardNavItem icon={faFileAlt} step={1} label="Setup" />
      <WizardNavItem icon={faFileAlt} step={2} label="Preview" />
      <WizardNavItem icon={faUser} step={3} label="Send Email" />
    </Nav>
  );
};

export default WizardNav;
