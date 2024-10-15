import React, { useState, useEffect } from 'react';
import { HvHeader, HvButton } from '@hitachivantara/uikit-react-core';
import { Tabs, Tab, Checkbox, CircularProgress } from '@mui/material';
import { CollapsibleIcons } from '../Navigations/CollapsibleIcons';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cards from '../DashboardMain/Cards';
import Footer from '../Footer/Footer';
import { fetchCostBreakdown } from '../services/costService';
import ReactTable from '../Table/Table';
import SparklineGraph from '../graphs/SparklineGraph';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [startDate, setStartDate] = useState('2024-03-01');
  const [endDate, setEndDate] = useState('2024-09-01');
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 
  const [buttonDisabled, setButtonDisabled] = useState(false); 

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to fetch data from the API
  const launchInvestigation = async () => {
    setLoading(true); // Start loading
    setButtonDisabled(true); // Disable button

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

        setData(Object.values(transformedData));
      } else {
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      console.error('Failed to fetch cost breakdown:', error);
    } finally {
      setLoading(false); 
      setButtonDisabled(false); 
    }
  };

  // Fetch data on page load using useEffect
  useEffect(() => {
    launchInvestigation(); 
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
          <Cards />

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
              {loading && (
                <div className='lodertable'>
                  <CircularProgress />
                </div>
              )}

              {/* Table with transparency when loading */}
              <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
                <ReactTable data={data} />
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
