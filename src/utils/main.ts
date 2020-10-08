import { Dataset } from '../types/data.types';

const getDataset = (data: Dataset[]) => {
  let input: number[][] = [];
  let output: number[] = [];
  data.forEach(({ average, set }) => {
    input.push(set);
    output.push(average);
  });
  return { input, output };
};

export const getSimpleMovingAverage = (data: string[], windowSize: number) => {
  const sma = [];
  const maxCount = Math.floor(data.length / windowSize);
  for (let i = 0; i < maxCount; i++) {
    const set = data.splice(0, windowSize).map(d => parseFloat(d));
    const average = set.reduce((acc, cur) => acc + cur, 0.0) / set.length;
    sma.push({ average, set });
  }
  return sma;
};

export const getTrainingDataset = (data: Dataset[], trainingSize: number) => {
  let { input, output } = getDataset(data);
  input = input.slice(0, Math.floor(trainingSize * input.length));
  output = output.slice(0, Math.floor(trainingSize * output.length));
  return { input, output };
};

export const getValidationDataset = (data: Dataset[], trainingSize: number) => {
  let { input, output } = getDataset(data);
  input = input.slice(Math.floor(trainingSize * input.length), input.length - 1);
  output = output.slice(Math.floor(trainingSize * output.length), output.length - 1);
  return { input, output };
};
