import React from 'react';
import { Table } from 'react-bootstrap';
import {
  flexRender,
  useReactTable,
  getCoreRowModel
} from '@tanstack/react-table';
import classNames from 'classnames';
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
  const { data = [], columns, ...tablePropsWithoutCustom } = tableProps || {};

  // TanStack Table instance'ını oluşturuyoruz.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="scrollbar ms-n1 ps-1">
      <Table {...tablePropsWithoutCustom}>
        <thead className={headerClassName}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
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
          ))}
        </thead>
        <tbody className={bodyClassName}>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={rowClassName}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} {...cell.column.columnDef.meta?.cellProps}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
};

export default AdvanceTable;
