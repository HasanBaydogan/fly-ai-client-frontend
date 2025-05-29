import { useEffect, useState } from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames';
import {
  Rating as ReactRating,
  RatingProps as ReactRatingProps
} from 'react-simple-star-rating';

export interface RatingData {
  easeOfSupply: number;
  dialogSpeed: number;
  dialogQuality: number;
  supplyCapability: number;
  euDemandOfParts: number;
}

export interface RatingProps extends ReactRatingProps {
  iconClass?: string;
  fillIconColor?: string;
  emptyIconColor?: string;
  allowHalfStars?: boolean;
}

interface RatingComponentProps {
  onRatingsChange: (ratings: RatingData) => void;
  ratings: RatingData;
}

const Rating = ({
  iconClass,
  allowHalfStars = false,
  fillIconColor = 'warning',
  emptyIconColor = 'warning-light',
  ...rest
}: RatingProps) => {
  return (
    <ReactRating
      allowFraction={allowHalfStars}
      fillColor="#FFD700"
      emptyColor="#DDDDDD"
      style={{ display: 'inline-block' }}
      size={30}
      {...rest}
    />
  );
};

const RatingComponent = ({
  onRatingsChange,
  ratings
}: RatingComponentProps) => {
  const handleRating = (category: keyof RatingData, rate: number) => {
    const newRatings = { ...ratings, [category]: rate };
    onRatingsChange(newRatings);
  };

  return (
    <ListGroup as="ul" style={{ maxWidth: '500px', margin: 'auto' }}>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            Ease Of Supply:
          </span>
          <Rating
            onClick={rate => handleRating('easeOfSupply', rate)}
            initialValue={ratings.easeOfSupply}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            Dialog Speed:
          </span>
          <Rating
            onClick={rate => handleRating('dialogSpeed', rate)}
            initialValue={ratings.dialogSpeed}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            Dialog Quality:
          </span>
          <Rating
            onClick={rate => handleRating('dialogQuality', rate)}
            initialValue={ratings.dialogQuality}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            Supply Capability:
          </span>
          <Rating
            onClick={rate => handleRating('supplyCapability', rate)}
            initialValue={ratings.supplyCapability}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            EU Demand of Parts:
          </span>
          <Rating
            onClick={rate => handleRating('euDemandOfParts', rate)}
            initialValue={ratings.euDemandOfParts}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};

// interface RatingSectionProps {
//   onRatingsChange: (ratings: RatingData) => void;
//   ratings: RatingData;
// }

// const RatingSection = ({ onRatingsChange, ratings }: RatingSectionProps) => {
//   return (
//     <Col
//       md={5}
//       className="d-flex align-items-center my-3 justify-content-center"
//     >
//       <RatingComponent onRatingsChange={onRatingsChange} ratings={ratings} />
//     </Col>
//   );
// };

export default RatingComponent;
