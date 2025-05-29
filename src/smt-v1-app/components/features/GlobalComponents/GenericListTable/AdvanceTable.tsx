import { Table } from 'react-bootstrap';
import {
  flexRender,
  useReactTable,
  getCoreRowModel
} from '@tanstack/react-table';
import classNames from 'classnames';

interface AdvanceTableProps<T> {
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  tableProps?: {
    className?: string;
    data: T[];
    columns: any[];
    [key: string]: any;
  };
  hasFooter?: boolean;
  renderRow?: (row: T) => React.ReactNode;
}

function AdvanceTable<T>({
  headerClassName,
  bodyClassName,
  rowClassName,
  tableProps,
  hasFooter,
  renderRow
}: AdvanceTableProps<T>) {
  const { data = [], columns, ...tablePropsWithoutCustom } = tableProps || {};

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="ms-n1 ps-1 text-center">
      <Table {...tablePropsWithoutCustom}>
        <thead className={headerClassName}>
          <tr>
            {table.getFlatHeaders().map(header => (
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
          {table.getRowModel().rows.map(row =>
            renderRow ? (
              renderRow(row.original)
            ) : (
              <tr key={row.id} className={rowClassName}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={classNames(
                      cell.column.columnDef.meta?.cellProps?.className
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>

        {hasFooter && (
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
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
}

export default AdvanceTable;
