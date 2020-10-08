import { TensorflowStock } from '../services/TensorflowStock';
import config from '../config.json';

const SAMPLE_INPUT = [120.51, 118.83, 118.09, 118.95, 121.73];

(async () => {
  const tensorflowStock = new TensorflowStock();
  const prediction = await tensorflowStock.predict([SAMPLE_INPUT], config);
  console.log('Prediction:', prediction);
})();
