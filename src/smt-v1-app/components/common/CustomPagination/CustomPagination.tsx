import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({
  pageNo,
  setPageNo,
  totalPage,
  totalItem
}: {
  pageNo: number;
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  totalItem: number;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNo(pageNumber);
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNo < totalPage) {
      setPageNo(pageNo + 1);
    }
  };
  return (
    <div>
      <Pagination className="mb-2 justify-content-end">
        <Pagination.Prev onClick={handlePrevPage} disabled={pageNo === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Pagination.Prev>

        {/* First 3 Pages */}
        {Array.from({ length: Math.min(3, totalPage) }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === pageNo}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        {/* Ellipsis if necessary */}
        {pageNo > 4 && totalPage > 6 && <Pagination.Ellipsis disabled />}

        {/* Current Page (if not part of the first/last 3) */}
        {pageNo > 3 && pageNo < totalPage - 2 && (
          <Pagination.Item active onClick={() => handlePageChange(pageNo)}>
            {pageNo}
          </Pagination.Item>
        )}

        {/* Ellipsis before last pages */}
        {pageNo < totalPage - 3 && totalPage > 6 && (
          <Pagination.Ellipsis disabled />
        )}

        {/* Last 3 Pages */}
        {Array.from({ length: 3 }, (_, index) => {
          const pageIndex = totalPage - 3 + index;
          if (pageIndex + 1 > 3) {
            return (
              <Pagination.Item
                key={pageIndex + 1}
                active={pageIndex + 1 === pageNo}
                onClick={() => handlePageChange(pageIndex + 1)}
              >
                {pageIndex + 1}
              </Pagination.Item>
            );
          }
          return null;
        })}

        <Pagination.Next
          onClick={handleNextPage}
          disabled={pageNo === totalPage}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Pagination.Next>
      </Pagination>
      <div className="mb-2 d-flex flex-row justify-content-end">
        <span className="fw-bold">{totalItem}</span>&nbsp;items listed
      </div>
    </div>
  );
};

export default CustomPagination;
