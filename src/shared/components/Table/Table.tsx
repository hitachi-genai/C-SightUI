import React, { useMemo } from 'react';
import { TableInstance, Row, UsePaginationInstanceProps, UseSortByInstanceProps, UseExpandedRowProps, TableState, useTable, useSortBy, useExpanded, usePagination, useRowSelect, Column } from 'react-table';

import { Checkbox } from '@mui/material';
import './Table.css';
import SparklineGraph from '../graphs/SparklineGraph';

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
                    <span  {...row.getToggleRowExpandedProps()}
                        style={{ cursor: 'pointer', textTransform: 'none', whiteSpace: 'normal', wordWrap: 'break-word',fontWeight: 'bolder'  }}>
                        {row.isExpanded ? '▼ ' : '▶ '}
                        {row.original.serviceCategory
                            .toLowerCase()
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </span>
                ),
            },
            {
                Header: 'Service name',
                accessor: 'services',
                id: 'serviceName',
                Cell: ({ row }: { row: any }) => {
                    const uniqueServiceNames = Array.from(new Set(row.original.services.map((service: Service) => service.serviceName)));
                    const serviceNames = uniqueServiceNames.join(', ');
                    return <span style={{ fontWeight: 'bolder' }}>{serviceNames}</span>;
                },
                
                // Cell: ({ row }: { row: any }) => {
                //     const serviceNames = row.original.services.map((service: Service) => service.serviceName).join(', ');
                //     return <span style={{fontWeight:'bolder'}}>{serviceNames}</span>;
                // },
            },
            {
                Header: 'Sub-service name',
                accessor: 'services',
                id: 'subServiceName',
                Cell: ({ row }: { row: any }) => {
                    const subServiceCount = row.original.services.length;
                    return <span style={{fontWeight:'bolder'}}>{subServiceCount} sub-services</span>;
                },
            },
            {
                Header: 'Total cost (USD)',
                accessor: 'services',
                id: 'totalCost',
                Cell: ({ row }: { row: any }) => {
                    const totalCost = row.original.services.reduce((sum: number, service: Service) => {
                        return sum + Number(service.chargeDescriptionCost) || 0; 
                    }, 0);
                    const formattedTotalCost = totalCost.toFixed(0);
                    return <span style={{fontWeight:'bolder'}}>${formattedTotalCost}</span>;
                },
                sortType: (rowA: any, rowB: any) => {
                    const totalA = rowA.original.services.reduce((sum: number, service: Service) => sum + Number(service.chargeDescriptionCost) || 0, 0);
                    const totalB = rowB.original.services.reduce((sum: number, service: Service) => sum + Number(service.chargeDescriptionCost) || 0, 0);
                    return totalA - totalB; 
                },
            },
            {
                Header: 'Costs over time',
                accessor: 'services[0].graph',
                id: 'costsOverTime',
                Cell: ({ row }: { row: any }) => {
                   
                    const aggregatedData = row.original.services.reduce((acc: any[], service: Service) => {
                        service.graph.props.data.forEach((dataPoint: { date: string; incurredCost: number }) => {
                            const existingDataPoint = acc.find((dp) => dp.date === dataPoint.date);
                            if (existingDataPoint) {
                                existingDataPoint.incurredCost += dataPoint.incurredCost;
                            } else {
                                acc.push({ date: dataPoint.date, incurredCost: dataPoint.incurredCost });
                            }
                        });
                        return acc;
                    }, []);
            
                    // Sort aggregated data by date in ascending order
                    aggregatedData.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
                    // Calculate the total cost
                    const totalCost = aggregatedData.reduce((sum: number, dataPoint: { incurredCost: number }) => sum + dataPoint.incurredCost, 0);
            
                    return (
                        <div>
                            {/* <span>${totalCost.toFixed(2)}</span> */}
                            <SparklineGraph data={aggregatedData} />
                        </div>
                    );
                },
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
                                                            <th>Total Cost (USD)↑</th>
                                                            <th>Costs Over Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Sort services by total cost in descending order before rendering */}
                                                        {(row.original as Data).services
                                                            .sort((a: Service, b: Service) => b.chargeDescriptionCost - a.chargeDescriptionCost)
                                                            .map((service: Service) => {
                                                                const sortedGraphData = service.graph.props.data.sort((a: { date: string }, b: { date: string }) =>
                                                                    new Date(a.date).getTime() - new Date(b.date).getTime()
                                                                )
                                                                return (
                                                                <tr key={`${service.serviceName}-${service.chargeDescriptionName}`}>
                                                                    <td>{service.serviceName}</td>
                                                                    <td>{service.chargeDescriptionName}</td>
                                                                    <td>${service.chargeDescriptionCost}</td>
                                                                    <td><SparklineGraph data={sortedGraphData} /></td>
                                                                </tr>
                                                                 );
                                                                })}
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
