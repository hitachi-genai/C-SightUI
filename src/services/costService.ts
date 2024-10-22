export const fetchCostBreakdown = async (startDate: string, endDate: string) => {
  const payload = {
    chargePeriodStart: startDate,
    chargePeriodEnd: endDate,
    periodicity: 'monthly',
    subscriptionIds: null,
    cspProvider: null,
    billingCurrency: 'USD',
  };

  try {
    const response = await fetch('https://resource-usage-metrics.dev.hitachi-ai.io/resourceusagemetrics/v1/api/usagemetrics/servicecategory/incurredcostbreakdown', {
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
    throw error; // Re-throw to allow component to handle it
  }
};
