import axios from 'axios';

const API_KEY = 'XMVXPQXVHBXVXVXV'; // Replace with a valid Alpha Vantage API key

const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'API request failed');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response received from the server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
    throw new Error('Error setting up the request');
  }
};

export const fetchStockData = async (symbol, startDate, endDate) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
        outputsize: 'full'
      }
    });

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No data available for the given symbol');
    }

    const filteredData = Object.entries(timeSeries)
      .filter(([date]) => date >= startDate && date <= endDate)
      .map(([date, values]) => ({
        date,
        open: values['1. open'],
        high: values['2. high'],
        low: values['3. low'],
        close: values['4. close'],
        volume: values['5. volume']
      }));

    return filteredData.reverse();
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCryptoData = async (symbol, startDate, endDate) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'DIGITAL_CURRENCY_DAILY',
        symbol: symbol,
        market: 'USD',
        apikey: API_KEY
      }
    });

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    const timeSeries = response.data['Time Series (Digital Currency Daily)'];
    if (!timeSeries) {
      throw new Error('No data available for the given symbol');
    }

    const filteredData = Object.entries(timeSeries)
      .filter(([date]) => date >= startDate && date <= endDate)
      .map(([date, values]) => ({
        date,
        open: values['1a. open (USD)'],
        high: values['2a. high (USD)'],
        low: values['3a. low (USD)'],
        close: values['4a. close (USD)'],
        volume: values['5. volume'],
        marketCap: values['6. market cap (USD)']
      }));

    return filteredData.reverse();
  } catch (error) {
    handleApiError(error);
  }
};