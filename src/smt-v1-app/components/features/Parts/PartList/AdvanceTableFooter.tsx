import { Col, Pagination, Row } from 'react-bootstrap';
import Button from 'components/base/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import usePagination from 'hooks/usePagination';
import {
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
  pageSize: number | 'all';
  setPageSize: (size: number | 'all') => void;
  setPageIndex: (index: number) => void;
}

const AdvanceTableFooter = ({
  className,
  pagination,
  navBtn,
  tableInfo,
  totalItems,
  pageIndex,
  setPageIndex,
  pageSize
}: AdvanceTableFooterProps) => {
  // Eğer "all" seçildiyse toplam sayfa 1 olacak
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalItems / pageSize);

  // Pagination hook'u sadece sayfa boyutu "all" değilken kullanılabilir
  const { hasNextEllipsis, hasPrevEllipsis, visiblePaginationItems } =
    usePagination({
      currentPageNo: pageIndex + 1,
      totalPage: totalPages,
      maxPaginationButtonCount: 4
    });

  return (
    <Row className={classNames(className, 'align-items-center py-1')}>
      <Col className="d-flex fs-9">
        <p
          className={classNames(
            tableInfo,
            'mb-0 d-none d-sm-block me-3 fw-semibold text-body'
          )}
        >
          {pageSize === 'all'
            ? `1 to ${totalItems}`
            : `${pageSize * pageIndex + 1} to ${
                pageSize * (pageIndex + 1) > totalItems
                  ? totalItems
                  : pageSize * (pageIndex + 1)
              } items of ${totalItems}`}
        </p>
      </Col>

      {navBtn && (
        <Col xs="auto" className="d-flex gap-2 ">
          <Button
            variant="link"
            startIcon={
              <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
            }
            className={classNames('px-1', { disabled: pageIndex === 0 })}
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

            {/* Eğer pageSize "all" ise, sadece tek sayfa gösterilir */}
            {pageSize === 'all' ? (
              <Pagination.Item active={true} onClick={() => setPageIndex(0)}>
                1
              </Pagination.Item>
            ) : (
              <>
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
