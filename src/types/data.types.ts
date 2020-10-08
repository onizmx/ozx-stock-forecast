type Dataset = {
  average: number;
  set: number[];
};

type MetaData = {
  '1. Information': string;
  '2. Symbol': string;
  '3. Last Refreshed': string;
  '4. Output Size': string;
  '5. Time Zone': string;
};

type TimeSeriesDaily = {
  [date: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. adjusted close': string;
    '6. volume': string;
    '7. dividend amount': string;
    '8. split coefficient': string;
  };
};

type AlphaVantageResponse = {
  'Meta Data': MetaData;
  'Time Series (Daily)': TimeSeriesDaily;
};

export type { Dataset, AlphaVantageResponse };
