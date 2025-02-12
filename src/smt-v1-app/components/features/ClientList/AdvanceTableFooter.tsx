import { useState } from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';
import Button from 'components/base/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import usePagination from 'hooks/usePagination';
import {
  faAngleRight,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface AdvanceTableFooterProps {
  className?: string;
  pagination?: boolean;
  navBtn?: boolean;
  showViewAllBtn?: boolean;
  viewAllBtnClass?: string;
  tableInfo?: string;
  totalItems: number;
  pageIndex: number;
  setPageIndex: (index: number) => void;
}

const AdvanceTableFooter = ({
  className,
  pagination,
  navBtn,
  showViewAllBtn = true,
  viewAllBtnClass,
  tableInfo,
  totalItems,
  pageIndex,
  setPageIndex
}: AdvanceTableFooterProps) => {
  // Varsayılan olarak sayfa başına gösterilecek kayıt sayısı,
  // API’den kullandığınız pageSize değeri ile uyumlu olmalı (örneğin, 6).
  const pageSize = 6;

  // Toplam sayfa sayısını hesaplıyoruz.
  const totalPages = Math.ceil(totalItems / pageSize);

  // usePagination hook’unu, backend’den gelen toplam sayfa sayısını kullanarak çağırıyoruz.
  const { hasNextEllipsis, hasPrevEllipsis, visiblePaginationItems } =
    usePagination({
      currentPageNo: pageIndex + 1,
      totalPage: totalPages,
      maxPaginationButtonCount: 4
    });

  const [isAllVisible, setIsAllVisible] = useState(false);

  return (
    <Row className={classNames(className, 'align-items-center py-1')}>
      <Col className="d-flex fs-9">
        <p
          className={classNames(
            tableInfo,
            'mb-0 d-none d-sm-block me-3 fw-semibold text-body'
          )}
        >
          {pageSize * pageIndex + 1} to{' '}
          {pageSize * (pageIndex + 1) > totalItems
            ? totalItems
            : pageSize * (pageIndex + 1)}
          <span className="text-body-tertiary"> items of </span>
          {totalItems}
        </p>
      </Col>
      {navBtn && (
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="link"
            startIcon={
              <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
            }
            className={classNames('px-1', {
              disabled: pageIndex === 0
            })}
            onClick={() => {
              if (pageIndex > 0) setPageIndex(pageIndex - 1);
            }}
          >
            Previous
          </Button>
          <Button
            variant="link"
            endIcon={<FontAwesomeIcon icon={faChevronRight} className="ms-2" />}
            className={classNames('px-1', {
              disabled: pageIndex >= totalPages - 1
            })}
            onClick={() => {
              if (pageIndex < totalPages - 1) setPageIndex(pageIndex + 1);
            }}
          >
            Next
          </Button>
        </Col>
      )}
      {pagination && (
        <Col xs="auto">
          <Pagination className="mb-0 justify-content-center">
            <Pagination.Prev
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Pagination.Prev>

            {hasPrevEllipsis && (
              <>
                <Pagination.Item
                  active={pageIndex === 0}
                  onClick={() => setPageIndex(0)}
                >
                  1
                </Pagination.Item>
                <Pagination.Ellipsis disabled />
              </>
            )}

            {visiblePaginationItems.map(page => (
              <Pagination.Item
                key={page}
                active={pageIndex === page - 1}
                onClick={() => setPageIndex(page - 1)}
              >
                {page}
              </Pagination.Item>
            ))}

            {hasNextEllipsis && (
              <>
                <Pagination.Ellipsis disabled />
                <Pagination.Item
                  active={pageIndex === totalPages - 1}
                  onClick={() => setPageIndex(totalPages - 1)}
                >
                  {totalPages}
                </Pagination.Item>
              </>
            )}
            <Pagination.Next
              disabled={pageIndex >= totalPages - 1}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Pagination.Next>
          </Pagination>
        </Col>
      )}
    </Row>
  );
};

export default AdvanceTableFooter;
