import { Table, Badge } from 'react-bootstrap';
import { flexRender } from '@tanstack/react-table';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import classNames from 'classnames';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import ActionDropdownItems from './SupplierListTable/ActionDropdownItems/ActionDropdownItems';
import { CustomTableProps } from './CustomTableProps';

interface AdvanceTableProps {
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  tableProps?: CustomTableProps;
  hasFooter?: boolean;
}

const AdvanceTable = ({
  headerClassName,
  bodyClassName,
  rowClassName,
  tableProps,
  hasFooter
}: AdvanceTableProps) => {
  const table = useAdvanceTableContext();
  const { getFlatHeaders, getFooterGroups } = table;
  const { data = [], columns, ...tablePropsWithoutCustom } = tableProps || {};

  const renderSegments = (segments: { segmentName: string }[]) => {
    if (!segments || segments.length === 0) return '';
    if (segments.length === 1) {
      return <div>• {segments[0].segmentName}</div>;
    } else if (segments.length === 2) {
      return (
        <>
          <div>• {segments[0].segmentName}</div>
          <div>• {segments[1].segmentName}</div>
        </>
      );
    } else {
      return (
        <>
          <div>• {segments[0].segmentName}</div>
          <div>• {segments[1].segmentName}</div>
          <div>• ...</div>
        </>
      );
    }
  };

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
          {data.map(row => (
            <tr key={row.id} className={rowClassName}>
              <td>{row.companyName}</td>
              <td>{renderSegments(row.segments)}</td>
              <td>{row.brand}</td>
              <td>{row.country}</td>
              <td>{row.address}</td>
              <td>{row.contacts?.[0]?.email || row.email}</td>
              <td>
                <Badge
                  bg={
                    row.status?.label.toLowerCase() === 'contacted'
                      ? 'success'
                      : row.status?.label.toLowerCase() === 'not_contacted'
                      ? 'warning'
                      : row.status?.label.toLowerCase() === 'black_listed'
                      ? 'danger'
                      : 'default'
                  }
                >
                  {row.status?.label}
                </Badge>
              </td>
              <td>
                <RevealDropdownTrigger>
                  <RevealDropdown>
                    <ActionDropdownItems
                      supplierId={row.id}
                      supplierData={row}
                    />
                  </RevealDropdown>
                </RevealDropdownTrigger>
              </td>
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
