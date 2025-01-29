import { Col } from 'react-bootstrap';
import Rating from './Rating';

const RatingSection = () => {
  return (
    <Col
      md={5}
      className="d-flex align-items-center mb-5 justify-content-center"
    >
      <Rating />
    </Col>
  );
};

export default RatingSection;
