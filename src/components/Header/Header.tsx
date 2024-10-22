import React, { useState, useEffect } from 'react';
import { HvButton } from '@hitachivantara/uikit-react-core';
import { Tabs, Tab, Checkbox, CircularProgress } from '@mui/material';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cards from '../../shared/components/DashboardMain/Cards';
import { fetchCostBreakdown } from '../../services/costService';
import ReactTable from '../../shared/components/Table/Table';
import SparklineGraph from '../../shared/components/graphs/SparklineGraph';
import { useQuery, useMutation } from 'react-query';

function Header() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-10-01');
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  // Function to transform the API response data
  const transformData = (result: any) => {
    const transformedData: any = {};
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
            chargeDescriptionCost: parseFloat(charge.chargeDescriptionCost).toFixed(0),
            graph: (
              <SparklineGraph
              data={charge.incurredCostsByTimeUnit.map((cost: { incurredCost: number }) => Math.round(cost.incurredCost))}
            />
            ),
          });
        });
      });
    });
    return Object.values(transformedData);
  };

  // Fetch data on page load using useQuery
  const { data: initialData, isLoading } = useQuery(
    ['costBreakdown', startDate, endDate],
    () => fetchCostBreakdown(startDate, endDate).then(transformData),
    {
      enabled: true, // Always fetch on mount
    }
  );

  // Update local state with fetched data
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Launch investigation using useMutation
  const mutation = useMutation(async () => {
    setButtonDisabled(true); // Disable button

    const result = await fetchCostBreakdown(startDate, endDate);
    return transformData(result);
  }, {
    onSuccess: (data) => {
      setData(data); // Update state with new data
      setButtonDisabled(false); // Re-enable button
    },
    onError: () => {
      console.error('Failed to fetch cost breakdown');
      setButtonDisabled(false); // Re-enable button in case of error
    },
  });

  const launchInvestigation = () => {
    mutation.mutate(); // Trigger the mutation
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '105vh', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '16px', overflowY: 'auto', transition: 'flex 0.3s ease' }}>
          <Cards />

          <h1 className="detailcost">Detailed Cloud Cost Breakdown</h1>
          <div className="dashboard-main" style={{ display: 'flex' }}>
            <aside className="filter-section" style={{ width: '25%', marginRight: '16px' }}>
              <h3 className='catTitle'>Categories</h3>
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
                <HvButton
                  variant="primary"
                  color="primary"
                  className='btninvest'
                  onClick={launchInvestigation}
                  disabled={buttonDisabled}
                  style={{ opacity: buttonDisabled ? 0.6 : 1 }}
                >
                  {buttonDisabled ? 'Loading...' : 'Launch investigation'}
                </HvButton>
              </div>
            </aside>

            <div style={{ flex: 1, position: 'relative' }}>
              <Tabs value={tabValue} onChange={handleTabChange} style={{ marginBottom: '16px' }}>
                <Tab label="By cloud service" />
                <Tab label="By model" />
                <Tab label="By environment" />
                <Tab label="By PoP service" />
                <Tab label="By team" />
              </Tabs>

              {/* Loader on top of the table */}
              {mutation.isLoading && (
                <div className='lodertable'>
                  <CircularProgress />
                </div>
              )}

              {/* Table with transparency when loading */}
              <div style={{ opacity: mutation.isLoading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
                <ReactTable data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
