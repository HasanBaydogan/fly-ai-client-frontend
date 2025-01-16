import { useWizardFormContext } from 'providers/WizardFormProvider';
import { useState } from 'react';
import avatarPlaceholder from 'assets/img/team/avatar.webp';
import { WizardFormData } from 'pages/modules/forms/WizardExample';

const WizardPersonalForm = () => {
  const methods = useWizardFormContext<WizardFormData>();
  const [avatar, setAvatar] = useState(avatarPlaceholder);

  const onDrop = (acceptedFiles: File[]) => {
    setAvatar(URL.createObjectURL(acceptedFiles[0]));
  };

  return <></>;
};

export default WizardPersonalForm;
