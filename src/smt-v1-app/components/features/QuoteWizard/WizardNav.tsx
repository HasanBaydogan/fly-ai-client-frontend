import {
  faCheck,
  faFileAlt,
  faLock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import WizardNavItem from 'components/wizard/WizardNavItem';
import { Nav } from 'react-bootstrap';

const WizardNav = () => {
  return (
    <Nav className="justify-content-between nav-wizard nav-wizard-success">
      <WizardNavItem icon={faUser} step={1} label="Personal" />
      <WizardNavItem icon={faFileAlt} step={2} label="Billing" />
      <WizardNavItem icon={faCheck} step={3} label="Done" />
    </Nav>
  );
};

export default WizardNav;
