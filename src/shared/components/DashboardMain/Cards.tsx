import { useQuery } from 'react-query';
import CloudCostsLineChart from '../graphs/CloudCostsLineChart';
import ServiceCostsBarChart from '../graphs/ServiceCostsBarChart';
import { fetchTotalIncurredCost } from '../../../services/cloudCostService';
import { fetchTotalIncurredCostAllTime, fetchTotalIncurredCostLastMonth } from '../../../services/incurredCost';
import './cards.css';

const Cards = () => {
  const { data: totalCostData, isError: isTotalCostError } = useQuery('totalCost', fetchTotalIncurredCost);
  const { data: allTimeCostData, isError: isAllTimeCostError } = useQuery('allTimeCost', fetchTotalIncurredCostAllTime);
  const { data: lastMonthCostData, isError: isLastMonthCostError } = useQuery('lastMonthCost', fetchTotalIncurredCostLastMonth);

  const totalCost = totalCostData?.data.totalIncurredCost || 0;
  const incurredCosts = totalCostData?.data.incurredCostsByTimeUnit || [];

  const maxIncurredCostAllTime = (() => {
    const responseData = allTimeCostData?.[0]?.data;
    if (responseData && responseData.serviceCategories) {
      const incurredCosts = responseData.serviceCategories;
      if (Array.isArray(incurredCosts) && incurredCosts.length > 0) {
        return Math.max(...incurredCosts.map(cost => cost.incurredCost));
      }
    }
    return 0;
  })();

  const LastMonthmaxIncurredCost = (() => {
    const responseData = lastMonthCostData?.[0]?.data;
    if (responseData && responseData.serviceCategories) {
      const incurredCosts = responseData.serviceCategories;
      if (Array.isArray(incurredCosts) && incurredCosts.length > 0) {
        return Math.max(...incurredCosts.map(cost => cost.incurredCost));
      }
    }
    return 0;
  })();



  // Handle errors for API calls
  if (isTotalCostError || isAllTimeCostError || isLastMonthCostError) {
    return <p>Failed to load data</p>;
  }

  return (
    <div className="dashboard-cards" style={{ display: 'flex', marginBottom: '16px' }}>
      <div className="card total-cost" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Total Cloud Costs</h3>
          <p>${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <CloudCostsLineChart incurredCosts={incurredCosts} />
          <span>↑ 25% Since last month</span>
        </div>
        <i className="far fa-light fa-money-bill-1" style={{ marginLeft: '8px', fontSize: '80px', color: '#white', marginTop: '-34%' }}></i>
      </div>

      <div className="card all-time-service" style={{ flex: 1, marginRight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>All Time Service Costs | Max Compute</h3>
          <p>${maxIncurredCostAllTime.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <ServiceCostsBarChart data={[20, 19, 18, 16, 10]}  />
          <span>↔ {maxIncurredCostAllTime.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cost range across service categories</span>
        </div>
        <i className="fas fa-magnifying-glass-dollar" style={{ marginLeft: '8px', fontSize: '80px', color: '#white', marginTop: '-34%' }}></i>
      </div>

      <div className="card last-month-service" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Last Month Service Costs | Max Compute</h3>
          <p>${LastMonthmaxIncurredCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p> {/* Updated to use last month cost */}
          <ServiceCostsBarChart data={[20, 19, 18, 16, 10]} />
          <span>↔ ${LastMonthmaxIncurredCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cost range across service categories</span> {/* Adjust this as needed */}
        </div>
        <i className="fas fa-calendar-day" style={{ marginLeft: '8px', fontSize: '80px', color: '#white', marginTop: '-34%' }}></i>
      </div>
    </div>
  );
};

export default Cards;
