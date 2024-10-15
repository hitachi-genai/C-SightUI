export const fetchTotalIncurredCostAllTime  = async () => {
    const payload = {
      chargePeriodStart: '2024-03-01',
      chargePeriodEnd: '2024-09-30',
      periodicity: 'monthly',
      subscriptionIds: null,
      cspProvider: null,
      billingCurrency: 'USD',
    };
  
    try {
      const response = await fetch('https://resource-usage-metrics.dev.hitachi-ai.io/resourceusagemetrics/v1/api/usagemetrics/servicecategory/incurredcost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API call failed', error);
      throw error; 
    }
  };
  
  export const fetchTotalIncurredCostLastMonth  = async () => {
    const payload = {
      chargePeriodStart: '2024-09-01',
      chargePeriodEnd: '2024-09-31',
      periodicity: 'monthly',
      subscriptionIds: null,
      cspProvider: null,
      billingCurrency: 'USD',
    };
  
    try {
      const response = await fetch('https://resource-usage-metrics.dev.hitachi-ai.io/resourceusagemetrics/v1/api/usagemetrics/servicecategory/incurredcost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API call failed', error);
      throw error; 
    }
  };