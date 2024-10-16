import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Collapse } from 'react-bootstrap';

interface RoomFilterCollapseProps {
  title: string;
  defaultOpen?: boolean;
  hideBorderBottom?: boolean;
  isCollapseAll: boolean;
  setIsCollapseAll: Dispatch<SetStateAction<boolean>>;
}

const RoomFilterCollapseItem = ({
  title,
  defaultOpen = true,
  children,
  hideBorderBottom = false,
  isCollapseAll = false,
  setIsCollapseAll
}: PropsWithChildren<RoomFilterCollapseProps>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (isCollapseAll) {
      setIsOpen(false);
      setIsCollapseAll(false);
    }
  }, [isCollapseAll]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={title.split(' ').join('_')}
        aria-expanded={isOpen}
        className="px-0 py-2 d-flex align-items-center mt-3 collapse-indicator"
      >
        <FontAwesomeIcon
          icon={faCaretDown}
          className="text-body me-2 toggle-icon "
        />
        <h5 className="text-body-highlight">{title}</h5>
      </Button>
      <Collapse in={isOpen}>
        <div
          id={title.split(' ').join('_')}
          className={hideBorderBottom ? undefined : 'border-bottom'}
        >
          <div className="pb-4">{children}</div>
        </div>
      </Collapse>
    </>
  );
};
export default RoomFilterCollapseItem;
