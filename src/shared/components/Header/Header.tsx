import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy, usePagination, useRowSelect, useExpanded, TableState, Row } from 'react-table';
import { HvHeader, HvButton } from '@hitachivantara/uikit-react-core';
import { Tabs, Tab, Checkbox } from '@mui/material';
import { CollapsibleIcons } from '../Navigations/CollapsibleIcons';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SparklineGraph from '../graphs/SparklineGraph';
import CloudCostsLineChart from '../graphs/CloudCostsLineChart';
import ServiceCostsBarChart from '../graphs/ServiceCostsBarChart';
import { fetchCostBreakdown } from '../services/costService';
import { fetchTotalIncurredCost } from '../services/cloudCostService';
import Footer from '../Footer/Footer';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('2024-03-01');
  const [endDate, setEndDate] = useState('2024-09-01');
  const [tabValue, setTabValue] = useState(0);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [incurredCosts, setIncurredCosts] = useState<any[]>([]);

  // Define columns for react-table
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
        // Expandable column for service category
        Header: 'Service category',
        accessor: 'serviceCategory',
        Cell: ({ row }: { row: any }) => (
          <span {...row.getToggleRowExpandedProps()}>
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
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 } as Partial<TableState<any>>,
    },
    useSortBy,
    useExpanded, // Move this before usePagination
    usePagination,
    useRowSelect
  );

  const { pageIndex, pageSize } = state as TableState<any> & { pageIndex: number; pageSize: number };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const launchInvestigation = async () => {
    try {
      const result = await fetchCostBreakdown(startDate, endDate);

      console.log('API Response:', result);

      if (
        Array.isArray(result) &&
        result.length > 0 &&
        result[0].data &&
        result[0].data.serviceCategories
      ) {
        const transformedData: any = {};

        // Group data by service category
        result[0].data.serviceCategories.forEach((category: any) => {
          const categoryName = category.serviceCategory;
          if (!transformedData[categoryName]) {
            transformedData[categoryName] = {
              serviceCategory: categoryName,
              services: [],
            };
          }
          category.serviceNames.forEach((service: any) => {
            service.chargeDescriptions.forEach((charge: any) => {
              transformedData[categoryName].services.push({
                serviceName: service.serviceName,
                chargeDescriptionName: charge.chargeDescriptionName,
                chargeDescriptionCost: parseFloat(charge.chargeDescriptionCost).toFixed(2),
                graph: (
                  <SparklineGraph
                    data={charge.incurredCostsByTimeUnit.map((cost: { incurredCost: number }) => cost.incurredCost)}
                  />
                ),
              });
            });
          });
        });

        // Convert the object to an array for react-table
        setData(Object.values(transformedData)); // Update the data in state
      } else {
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      console.error('Failed to fetch cost breakdown:', error);
    }
  };

  useEffect(() => {
    launchInvestigation();
  }, []);

  useEffect(() => {
    const getTotalCost = async () => {
      try {
        const result = await fetchTotalIncurredCost();
        setTotalCost(result.data.totalIncurredCost);
        setIncurredCosts(result.data.incurredCostsByTimeUnit);
      } catch (error) {
        console.error('Failed to fetch total incurred cost:', error);
      }
    };

    getTotalCost();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '105vh', backgroundColor: 'white' }}>
      <HvHeader position="relative" style={{ backgroundColor: '#1976d2' }}>
        <h1 className="logo">C-Sight</h1>
      </HvHeader>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <CollapsibleIcons isOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <div style={{ flex: isMenuOpen ? 1 : 1.2, padding: '16px', overflowY: 'auto', transition: 'flex 0.3s ease' }}>
          {/* Top Cards */}
          <div className="dashboard-cards" style={{ display: 'flex', marginBottom: '16px' }}>
            <div className="card total-cost" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Total Cloud Costs</h3>
                <p>${totalCost ? totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
                <CloudCostsLineChart incurredCosts={incurredCosts} />
                <span>↑ 25% Since last month</span>
              </div>
              <i className="far fa-light fa-money-bill-1" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
            </div>

            <div className="card all-time-service" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>All Time Service Costs | Max Compute</h3>
                <p>$223,686</p>
                <ServiceCostsBarChart data={[14, 5, 6, 8, 13]} />
                <span>↔ $223,684 Cost range across service categories</span>
              </div>
              <i className="fas fa-magnifying-glass-dollar" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
            </div>

            <div className="card last-month-service" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Last Month Service Costs | Max Compute</h3>
                <p>$72,744</p>
                <ServiceCostsBarChart data={[2, 4, 6, 8, 10]} />
                <span>↔ $72,742 Cost range across service categories</span>
              </div>
              <i className="fas fa-calendar-day" style={{ marginLeft: '8px', fontSize: '80px', color: '#70809078', marginTop: '-34%' }}></i>
            </div>
          </div>

          <h1 className="detailcost">Detailed Cloud Cost Breakdown</h1>
          <div className="dashboard-main" style={{ display: 'flex' }}>
            <aside className="filter-section" style={{ width: '25%', marginRight: '16px' }}>
              <h3 className='catTitle'>Categories</h3>
              {/* Filter checkboxes */}

              <ul style={{ listStyleType: 'none' }}>
                <li><Checkbox defaultChecked /> SUBLowerEnvs001</li>
                <li><Checkbox defaultChecked /> SUBMLPlayground</li>
                <li><Checkbox defaultChecked /> SUBHigherEnvs001</li>
                <li><Checkbox defaultChecked /> SUBHigherEnvs002</li>
                <li><Checkbox defaultChecked /> SUBHigherEnvs003</li>
              </ul>
              <div className="date-picker">
                <label>Start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="inputbox" />
                <label>End date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="inputbox" />
                <HvButton variant="primary" color="primary" className='btninvest' onClick={launchInvestigation}>
                  Launch investigation
                </HvButton>
              </div>
            </aside>

            <div style={{ flex: 1 }}>
              <Tabs value={tabValue} onChange={handleTabChange} style={{ marginBottom: '16px' }}>
                <Tab label="By cloud service" />
                <Tab label="By model" />
                <Tab label="By environment" />
                <Tab label="By PoP service" />
                <Tab label="By team" />
              </Tabs>


              {/* Record count */}
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
                      return (
                        <React.Fragment key={row.id}>
                          <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                              <td {...cell.getCellProps()} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                                {cell.render('Cell')}
                              </td>
                            ))}
                          </tr>
                          {/* Expanded Row */}
                          {(row as any).isExpanded ? (
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
                                    {row.original.services.map((service, index) => (
                                      <tr key={index}>
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

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Header;
