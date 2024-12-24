import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
    </div>
  );
};

export default LoadingAnimation;
