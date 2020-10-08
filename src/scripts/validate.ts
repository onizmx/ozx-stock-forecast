import * as helper from '../utils/main';
import { AlphaVantageResponse } from '../types/data.types';
import { TensorflowStock } from '../services/TensorflowStock';
import rawData from '../../data/get-time-series-ibm.json';
import config from '../config.json';

const timeSeriesData = rawData as AlphaVantageResponse;
const timeSeriesList = timeSeriesData['Time Series (Daily)'];
const timeSeriesKeys = Object.keys(timeSeriesList);
let timeSeriesPrices = timeSeriesKeys.map(k => timeSeriesList[k]['5. adjusted close']);
timeSeriesPrices = timeSeriesPrices.reverse(); // oldest to latest

(async () => {
  const { windowSize, trainingSize } = config;
  const data = helper.getSimpleMovingAverage(timeSeriesPrices, windowSize);
  const { input, output } = helper.getValidationDataset(data, trainingSize);
  output.shift();

  const tensorflowStock = new TensorflowStock();
  let validation = await tensorflowStock.predict(input, config);
  if (validation) {
    validation = output.map((o, idx) => o - validation![idx]);
    const diff = validation.reduce((acc, cur) => acc + cur, 0) / validation.length;
    console.log('Average Diff:', diff);
  }
})();
