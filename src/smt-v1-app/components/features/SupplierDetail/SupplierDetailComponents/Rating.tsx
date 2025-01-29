import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import {
  Rating as ReactRating,
  RatingProps as ReactRatingProps
} from 'react-simple-star-rating';
import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';

export interface RatingProps extends ReactRatingProps {
  iconClass?: string;
  fillIconColor?: string;
  emptyIconColor?: string;
  allowHalfStars?: boolean;
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
      initialValue={0}
      fillColor="#FFD700"
      emptyColor="#DDDDDD"
      style={{ display: 'inline-block' }}
      size={30}
      {...rest}
    />
  );
};

const RatingComponent = () => {
  const [ratings, setRatings] = useState({
    quality: 0,
    price: 0,
    usability: 0,
    design: 0
  });

  const handleRating = (category: string, rate: number) => {
    setRatings(prev => ({ ...prev, [category]: rate }));
  };

  return (
    <ListGroup as="ul" style={{ maxWidth: '500px', margin: 'auto' }}>
      <ListGroup.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '180px', fontWeight: 'bold' }}>
            Dialog Speed:
          </span>
          <Rating
            onClick={rate => handleRating('quality', rate)}
            initialValue={ratings.quality}
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
            onClick={rate => handleRating('price', rate)}
            initialValue={ratings.price}
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
            onClick={rate => handleRating('usability', rate)}
            initialValue={ratings.usability}
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
            onClick={rate => handleRating('design', rate)}
            initialValue={ratings.design}
            allowHalfStars={false}
            iconsCount={10}
          />
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default RatingComponent;
