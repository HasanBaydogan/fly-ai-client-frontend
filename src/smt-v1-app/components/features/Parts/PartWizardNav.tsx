import {
  faPlusSquare,
  faNoteSticky,
  faFileText,
  faPlane,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import WizardNavItem from './PartWizardNavItem';

interface WizardNavProps {
  disableOtherSteps?: boolean;
}

const WizardNav: React.FC<WizardNavProps> = ({ disableOtherSteps = false }) => {
  return (
    <Nav
      variant="pills"
      defaultActiveKey="link-1"
      className="justify-content-between nav-wizard nav-wizard-success"
    >
      <WizardNavItem
        icon={faPlane}
        step={1}
        label="Item Fields"
        disabled={false}
      />
      <WizardNavItem
        icon={faUser}
        step={2}
        label="User Defined Fields"
        disabled={disableOtherSteps}
      />
      <WizardNavItem
        icon={faNoteSticky}
        step={3}
        label="Notes"
        disabled={disableOtherSteps}
      />
      <WizardNavItem
        icon={faFileText}
        step={4}
        label="Files"
        disabled={disableOtherSteps}
      />
      <WizardNavItem
        icon={faPlusSquare}
        step={5}
        label="Alternatives"
        disabled={disableOtherSteps}
      />
    </Nav>
  );
};

export default WizardNav;
