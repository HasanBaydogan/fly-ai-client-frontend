import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface AdvanceTableFooterProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const AdvanceTableFooter: React.FC<AdvanceTableFooterProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
    );

    // Previous page
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Next page
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    );

    // Last page
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    );

    return items;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <Pagination>{renderPaginationItems()}</Pagination>
    </div>
  );
};

export default AdvanceTableFooter;
