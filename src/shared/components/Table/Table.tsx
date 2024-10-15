import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useRowSelect, useExpanded, TableState, Row, UseExpandedRowProps } from 'react-table';
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
    const columns = useMemo(
        () => [
            {
                Header: ({ getToggleAllRowsSelectedProps }: { getToggleAllRowsSelectedProps: any }) => (
                    <div>
                        <Checkbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
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
                    <span {...row.getToggleRowExpandedProps()} style={{ cursor: 'pointer' }}>
                        {row.isExpanded ? '▼ ' : '▶ '}
                        {row.original.serviceCategory}
                    </span>
                ),
            },
            { Header: 'Service name', accessor: 'services[0].serviceName' },
            { Header: 'Sub-service name', accessor: 'services[0].chargeDescriptionName' },
            { Header: 'Total cost (USD)', accessor: 'services[0].chargeDescriptionCost' },
            { Header: 'Costs over time', accessor: 'services[0].graph' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
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
            initialState: { pageIndex: 0, pageSize: 10 } as Partial<TableState<any>>,
        },
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect
    );

    const { pageIndex } = state as TableState<any> & { pageIndex: number };

    return (
        <>
            <div className='records'>
                <i className="fas fa-list" style={{ marginRight: '8px', color: '#1976d2' }}></i>
                <strong>{data.length} records</strong>
            </div>
            {/* Table */}
            <div className="table-container" style={{ overflow: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps((column as any).getSortByToggleProps())} style={{ borderBottom: '2px solid #ddd', textAlign: 'left', padding: '8px' }}>
                                        {column.render('Header')}
                                        <span>
                                            <span>{column.isSorted ? (column.isSortedDesc ? '↑' : '↓') : ''}</span>
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {page.map((row: Row<object>) => {
                            prepareRow(row);
                            const rowProps = row.getRowProps(); // Get row props without destructuring key

                            return (
                                <React.Fragment key={row.id}> {/* Use row.id directly here as the key */}
                                    <tr {...rowProps}> {/* Just pass rowProps here without modifying */}
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
                                                        {(row.original as Data).services.map((service: Service, index) => (
                                                            <tr key={index}> {/* Ensure a unique key for each service row */}
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
