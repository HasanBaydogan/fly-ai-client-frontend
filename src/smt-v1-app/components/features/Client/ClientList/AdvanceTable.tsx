// AdvanceTable.tsx
import { Table, Badge } from 'react-bootstrap';
import { flexRender } from '@tanstack/react-table';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import classNames from 'classnames';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import ActionDropdownItems from './ActionDropdownItems/ActionDropdownItems';
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
            <tr key={row.clientId} className={rowClassName}>
              <td>{row.companyName}</td>
              <td>{row.details}</td>
              <td>{row.currencyPreference}</td>
              <td>{row.website}</td>
              <td>{row.legalAddress}</td>
              <td>
                <Badge
                  bg={
                    row.clientStatus?.label.toLowerCase() === 'contacted'
                      ? 'success'
                      : row.clientStatus?.label.toLowerCase() ===
                        'not_contacted'
                      ? 'warning'
                      : row.clientStatus?.label.toLowerCase() === 'black_listed'
                      ? 'danger'
                      : 'default'
                  }
                >
                  {row.clientStatus?.label}
                </Badge>
              </td>
              <td>
                <RevealDropdownTrigger>
                  <RevealDropdown>
                    <ActionDropdownItems
                      clientId={row.clientId}
                      clientDataDetail={row}
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
