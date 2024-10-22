import React, { useMemo } from 'react';
import { TableInstance, Row, UsePaginationInstanceProps, UseSortByInstanceProps, UseExpandedRowProps, TableState, useTable, useSortBy, useExpanded, usePagination, useRowSelect, Column } from 'react-table';

import { Checkbox } from '@mui/material';
import './Table.css';

interface Service {
    serviceName: string;
    chargeDescriptionName: string;
    chargeDescriptionCost: number;
    graph: any;
}

interface Data {
    serviceCategory: string;
    services: Service[];
}

const ReactTable: React.FC<{ data: Data[] }> = ({ data }) => {
    const columns: Column<object>[] = useMemo(
        () => [
            {
                Header: 'Select',
                id: 'selection',
                Cell: ({ row }: { row: any }) => (
                    <div>
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            {
                Header: 'Service category',
                accessor: 'serviceCategory',
                Cell: ({ row }: { row: any }) => (
                    <span {...row.getToggleRowExpandedProps()} style={{ cursor: 'pointer', textTransform: 'none' }}>
                        {row.isExpanded ? '▼ ' : '▶ '}
                        {row.original.serviceCategory
                            .toLowerCase()
                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </span>
                ),
            },
            {
                Header: 'Service name',
                accessor: 'services[0].serviceName',
                id: 'serviceName',
            },
            {
                Header: 'Sub-service name',
                accessor: 'services[0].chargeDescriptionName',
                id: 'subServiceName',
            },
            {
                Header: 'Total cost (USD)',
                accessor: 'services[0].chargeDescriptionCost',
                id: 'totalCost',
            },
            {
                Header: 'Costs over time',
                accessor: 'services[0].graph',
                id: 'costsOverTime',
            },
        ],
        []
    );

    const {
        getTableProps,
        headerGroups,
        page,
        prepareRow,
        state,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10, sortBy: [{ id: 'totalCost', desc: true }] } as Partial<TableState<any>>,
        },
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect
    ) as TableInstance<object> & UsePaginationInstanceProps<object> & UseSortByInstanceProps<object>;

    const { pageIndex } = state as TableState<any> & { pageIndex: number };

    return (
        <>
            <div className="table-container" style={{ overflow: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps((column as any).getSortByToggleProps())} style={{ borderBottom: '2px solid #ddd', textAlign: 'left', padding: '8px' }}>
                                        {column.render('Header')}
                                        <span>{(column as any).isSorted ? ((column as any).isSortedDesc ? '↑' : '↓') : ''}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {page.map((row: Row<object>) => {
                            prepareRow(row);
                            const rowProps = row.getRowProps(); 

                            return (
                                <React.Fragment key={row.id}> 
                                    <tr {...rowProps}> 
                                        {row.cells.map((cell) => (
                                            <td {...cell.getCellProps()} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                    {/* Expanded Row */}
                                    {(row as Row<Data> & UseExpandedRowProps<Data>).isExpanded ? (
                                        <tr>
                                            <td colSpan={columns.length}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Service Name</th>
                                                            <th>Sub-Service Name</th>
                                                            <th>Total Cost (USD)</th>
                                                            <th>Costs Over Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Render unique services only */}
                                                        {(row.original as Data).services.filter((service: Service, index: number, self: Service[]) =>
                                                            index === self.findIndex(s => s.serviceName === service.serviceName)
                                                        ).map((service: Service) => (
                                                            <tr key={`${service.serviceName}-${service.chargeDescriptionName}`}> {/* Use a unique key for each service */}
                                                                <td>{service.serviceName}</td>
                                                                <td>{service.chargeDescriptionName}</td>
                                                                <td>${service.chargeDescriptionCost}</td>
                                                                <td>{service.graph}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            </div>
        </>
    );
};

export default ReactTable;
