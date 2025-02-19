import {
  faPlusSquare,
  faNoteSticky,
  faFileText,
  faPlane,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import WizardNavItem from './PartWizardNavItem';

const WizardNav = () => {
  return (
    <Nav
      variant="pills"
      defaultActiveKey="link-1"
      className="justify-content-between nav-wizard nav-wizard-success"
    >
      <WizardNavItem icon={faPlane} step={1} label="Item Fields" />
      <WizardNavItem icon={faUser} step={2} label="User Defined Fields" />
      <WizardNavItem icon={faNoteSticky} step={3} label="Notes" />
      <WizardNavItem icon={faFileText} step={4} label="Files" />
      <WizardNavItem icon={faPlusSquare} step={5} label="Alternatives" />
    </Nav>
  );
};

export default WizardNav;
