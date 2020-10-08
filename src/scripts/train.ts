import path from 'path';
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

(async function () {
  const { windowSize, trainingSize } = config;
  console.log('Total Days:', timeSeriesPrices.length);
  const data = helper.getSimpleMovingAverage(timeSeriesPrices, windowSize);
  console.log('Total Weeks:', data.length);
  console.log('Total Years:', data.length / 52);
  const { input, output } = helper.getTrainingDataset(data, trainingSize);

  await new TensorflowStock().train(input, output, config);
})();
