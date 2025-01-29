import { Row, Col } from 'react-bootstrap';
import SupplierInfo from '../../components/features/SupplierDetail/SupplierDetailComponents/SupplierInfo';
import SegmentSelection from '../../components/features/SupplierDetail/SupplierDetailComponents/SegmentSelection';
import AddressDetails from '../../components/features/SupplierDetail/SupplierDetailComponents/AddressDetails';
import RatingSection from '../../components/features/SupplierDetail/SupplierDetailComponents/RatingSection';
import WorkingDetails from '../../components/features/SupplierDetail/SupplierDetailComponents/WorkingDetails';
import FileUpload from '../../components/features/SupplierDetail/SupplierDetailComponents/FileUpload';
import AccountInfo from '../../components/features/SupplierDetail/SupplierDetailComponents/AccountInfo';
import ContactListSection from '../../components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
import CustomButton from '../../../components/base/Button';

const SupplierDetailContainer = () => {
  return (
    <>
      <SupplierInfo />
      <SegmentSelection onSelect={() => {}} />
      <Row className="mt-3">
        <Col md={7}>
          <AddressDetails />
        </Col>
        <Col
          md={5}
          className="d-flex justify-content-center align-items-center"
        >
          <RatingSection />
        </Col>
      </Row>

      <WorkingDetails />
      <FileUpload />
      <AccountInfo />
      <ContactListSection />

      <div className="d-flex mt-3 gap-3 mx-5 justify-content-end">
        <CustomButton variant="secondary">Cancel</CustomButton>
        <CustomButton variant="success">Save</CustomButton>
      </div>
    </>
  );
};

export default SupplierDetailContainer;
