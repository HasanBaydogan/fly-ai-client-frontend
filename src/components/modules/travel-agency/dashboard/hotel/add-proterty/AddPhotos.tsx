import Dropzone from 'components/base/Dropzone';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import { AddPropertyWizardFormData } from 'data/travel-agency/addProperty';

const AddPhotos = ({ title, images }: { title: string; images: File[] }) => {
  const methods = useWizardFormContext<AddPropertyWizardFormData>();
  const { formData, setFormData } = methods;

  return (
    <>
      <h3 className="mb-6">{title}</h3>

      <Dropzone
        accept={{
          'image/*': ['.png', '.gif', '.jpeg', '.jpg']
        }}
        defaultFiles={images}
        className="border border-dashed"
        onDrop={(acceptedFiles: File[]) => {
          setFormData({
            ...formData,
            photos: acceptedFiles
          });
        }}
      />
    </>
  );
};

export default AddPhotos;
