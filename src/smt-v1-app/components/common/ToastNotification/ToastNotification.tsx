import { Toast, ToastContainer } from 'react-bootstrap';
import { ToastPosition } from 'react-bootstrap/esm/ToastContainer';

type Props = {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  variant: string;
  messageHeader: string;
  messageBodyText: string;
  position?: ToastPosition;
};

const ToastNotification = (props: Props) => {
  return (
    <ToastContainer
      position={props.position ? props.position : 'bottom-end'}
      className="p-3"
      style={{ zIndex: 1 }}
    >
      <Toast
        className="d-inline-block m-1"
        bg={props.variant}
        z-index={5}
        onClose={() => props.setIsShow(false)}
        show={props.isShow}
        delay={3000}
        autohide
      >
        <Toast.Header closeVariant="white">
          <strong className="me-auto text-white">{props.messageHeader}</strong>
        </Toast.Header>
        <Toast.Body className={'text-white'}>
          {props.messageBodyText}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
