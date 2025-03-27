import { Table, Badge } from 'react-bootstrap';
import { flexRender } from '@tanstack/react-table';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import classNames from 'classnames';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { CustomTableProps } from './CustomTableProps';
import { PartData } from 'smt-v1-app/types/PartTypes';

interface AdvanceTableProps {
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  tableProps?: CustomTableProps;
  hasFooter?: boolean;
  openPartModal: (partId: string) => void;
}

const renderSegments = (segments: string[]) => {
  if (!segments || segments.length === 0) return '';
  if (segments.length === 1) {
    return <div>• {segments[0]}</div>;
  } else if (segments.length === 2) {
    return (
      <>
        <div>• {segments[0]}</div>
        <div>• {segments[1]}</div>
      </>
    );
  } else {
    return (
      <>
        <div>• {segments[0]}</div>
        <div>• {segments[1]}</div>
        <div>• ...</div>
      </>
    );
  }
};

const AdvanceTable = ({
  headerClassName,
  bodyClassName,
  rowClassName,
  tableProps,
  hasFooter,
  openPartModal
}: AdvanceTableProps) => {
  const table = useAdvanceTableContext();
  const { getFlatHeaders, getFooterGroups } = table;
  const { data = [], columns, ...tablePropsWithoutCustom } = tableProps || {};

  return (
    <div className="scrollbar ms-n1 ps-1">
      <Table {...tablePropsWithoutCustom}>
        <thead className={headerClassName}>
          <tr>
            {getFlatHeaders().map(header => (
              <th
                key={header.id}
                {...header.column.columnDef.meta?.headerProps}
                className={classNames(
                  header.column.columnDef.meta?.headerProps?.className
                )}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.map((row: PartData) => (
            <tr
              key={row.partId}
              className={rowClassName}
              style={{ height: '70px' }}
            >
              <td>
                <a
                  href="#"
                  className="text-decoration-none"
                  onClick={e => {
                    e.preventDefault();
                    openPartModal(row.partNumber);
                  }}
                >
                  {row.partNumber}
                </a>
              </td>
              <td>
                {Array.isArray(row.partName)
                  ? row.partName.join(', ')
                  : row.partName}
              </td>
              <td>{renderSegments(row.segments)}</td>
              <td>{row.aircraft}</td>
              <td>{row.aircraftModel}</td>
              <td>{row.oem}</td>
              <td>{row.hsCode}</td>
            </tr>
          ))}
        </tbody>
        {hasFooter && (
          <tfoot>
            {getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id} className="border-0 border-translucent">
                {footerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    {...header.column.columnDef.meta?.footerProps}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </Table>
    </div>
  );
};

export default AdvanceTable;
