import { useEffect, useState } from 'react';
import { getColorStyles } from '../RfqMailRowItem/RfqMailRowHelper';
import './RFQMailLog.css';
import userIcon from '../../../../assets/img/icons/user-icon.svg';

const RFQMailLog: React.FC<RFQMailLog> = (props: RFQMailLog) => {
  const [logText, setLogText] = useState(<></>);

  const logGenerating = () => {
    switch (props.actionType) {
      case 'ASSIGN':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">assigned</span>{' '}
            RFQ to {props.assignedOrBlockedSubject}{' '}
          </>
        );
        break;
      case 'BLOCK':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">blocked</span>{' '}
            RFQ to {props.assignedOrBlockedSubject}{' '}
          </>
        );
        break;
      case 'OPEN':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">opened</span>{' '}
            RFQ Mail{' '}
          </>
        );
        break;
      case 'CANCEL':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">canceled</span>{' '}
            RFQ Mail{' '}
          </>
        );
        break;
      case 'UPDATE':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">updated</span>{' '}
            RFQ Mail{' '}
          </>
        );
        break;
      case 'SAVE':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">saved</span> RFQ
            Mail{' '}
          </>
        );
        break;
      case 'ENTER':
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">entered</span>{' '}
            {props.enterItemsNumber} items{' '}
          </>
        );
        break;
      case 'CREATE':
        let fromStatusColorsInCreation = getColorStyles(
          props.quoteValues?.statusFrom ?? ''
        );
        let toStatusColorsInCreation = getColorStyles(
          props.quoteValues?.statusTo ?? ''
        );
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">created</span>{' '}
            <a
              href={'/quotes/quote?quoteId=' + props.quoteValues.quoteId}
              target="_blank"
              className="text-primary log-quote-hover"
            >
              {'Quote-'}
              {props.quoteValues.quoteNumberId}{' '}
            </a>{' '}
            , <span className="fw-bold text-decoration-underline">changed</span>{' '}
            RFQ Status From{' '}
            <span style={{ color: fromStatusColorsInCreation.bgColor }}>
              {props.quoteValues?.statusFrom}
            </span>{' '}
            To{' '}
            <span style={{ color: toStatusColorsInCreation.bgColor }}>
              {props.quoteValues?.statusTo}
            </span>
          </>
        );
        break;
      case 'CHANGE':
        let fromStatusColorsInChange = getColorStyles(
          props.changeValues?.statusFrom ?? ''
        );
        let toStatusColorsInChange = getColorStyles(
          props.changeValues?.statusTo ?? ''
        );
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline"> changed</span>{' '}
            RFQ status From{' '}
            <span
              style={{
                backgroundColor: fromStatusColorsInChange.bgColor,
                color: fromStatusColorsInChange.textColor
              }}
            >
              {props.changeValues?.statusFrom}{' '}
            </span>
            To{' '}
            <span
              style={{
                backgroundColor: toStatusColorsInChange.bgColor,
                color: toStatusColorsInChange.textColor
              }}
            >
              {props.changeValues?.statusTo}
            </span>
          </>
        );
        break;
      case 'POINT':
        let pointStatusColors = getColorStyles(
          props.pointValues.pointStatus ?? ''
        );
        setLogText(
          <>
            {' '}
            {props.userFullName}{' '}
            <span className="fw-bold text-decoration-underline">pointed</span>{' '}
            RFQ as{' '}
            <span style={{ color: pointStatusColors.bgColor }}>
              {props.pointValues.pointStatus}
            </span>
          </>
        );
        break;
    }
  };
  useEffect(() => {
    logGenerating();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <img src={userIcon} alt="user Icon" className="m-2" />
          {logText}
        </div>
        <div>
          <span className="log-date-time-font-style">{props.date}</span>
        </div>
      </div>
    </>
  );
};

export default RFQMailLog;
