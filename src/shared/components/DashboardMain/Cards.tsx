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

 // Function to sort the service categories by incurred cost in descending order
 const getSortedServiceData = (serviceCategories: any) => {
  if (!serviceCategories || !Array.isArray(serviceCategories)) return { categories: [], data: [] };

  const sortedData = [...serviceCategories].sort((a, b) => b.incurredCost - a.incurredCost); // Sort by incurredCost descending
  const categories = sortedData.map(category => category.serviceCategory);
  const data = sortedData.map(category => Math.round(category.incurredCost)); // Round incurredCost to nearest whole number
  
  return { categories, data };
};


// Get sorted service data for all-time and last month
const { categories: allTimeCategories, data: allTimeServiceData } = getSortedServiceData(allTimeCostData?.[0]?.data?.serviceCategories);
const { categories: lastMonthCategories, data: lastMonthServiceData } = getSortedServiceData(lastMonthCostData?.[0]?.data?.serviceCategories);


  // Handle errors for API calls
  if (isTotalCostError || isAllTimeCostError || isLastMonthCostError) {
    return <p>Failed to load data</p>;
  }

  return (

    <div className="dashboard-cards" style={{ display: 'flex', marginBottom: '16px' }}>
  <div className="card total-cost" style={{ flex: 1, marginRight: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Total Cloud Costs</h3>
      <p>${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <CloudCostsLineChart incurredCosts={incurredCosts} />
      <span>↑ 25% Since last month</span>
    </div>
    <i className="far fa-light fa-money-bill-1" style={{ fontSize: '60px', color: '#fff', marginLeft: '16px', alignSelf: 'flex-start' }}></i>
  </div>

  <div className="card all-time-service" style={{ flex: 1, marginRight: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>All Time Service Costs | Max Compute</h3>
      <p>${maxIncurredCostAllTime.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <ServiceCostsBarChart categories={allTimeCategories} data={allTimeServiceData} />
      <span>↔ {Math.max(...allTimeServiceData).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cost range across service categories</span>
    </div>
    <i className="fas fa-magnifying-glass-dollar" style={{ fontSize: '60px', color: '#fff', marginLeft: '16px', alignSelf: 'flex-start' }}></i>
  </div>

  <div className="card last-month-service" style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h3 style={{ display: 'inline-flex', alignItems: 'center' }}>Last Month Service Costs | Max Compute</h3>
      <p>${LastMonthmaxIncurredCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <ServiceCostsBarChart categories={lastMonthCategories} data={lastMonthServiceData} />
      <span>↔ ${Math.max(...lastMonthServiceData).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Cost range across service categories</span>
    </div>
    <i className="fas fa-calendar-day" style={{ fontSize: '60px', color: '#fff', marginLeft: '16px', alignSelf: 'flex-start' }}></i>
  </div>
</div>


  );
};

export default Cards;
