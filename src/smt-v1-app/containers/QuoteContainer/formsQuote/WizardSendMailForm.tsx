import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import { Col, Form, Row } from 'react-bootstrap';

const WizardSendMailForm = () => {
  const { formData, onChange, validation } =
    useWizardFormContext<WizardFormData>();

  return <div></div>;
};

export default WizardSendMailForm;
