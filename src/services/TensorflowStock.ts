import fs from 'fs';
import path from 'path';
import * as tf from '@tensorflow/tfjs-node';
// import * as tf from '@tensorflow/tfjs';
// import 'tfjs-node-save';

type Config = {
  root: string;
  model: string;
  windowSize: number;
  epochs: number;
  lstmLayers: number;
  learningRate: number;
  inputLayerNeurons: number;
  rnnInputLayerFeatures: number;
  rnnOutputNeurons: number;
  outputLayerNeurons: number;
};

const MODELS_PATH = path.resolve(__dirname + '../../../../models');

export class TensorflowStock {
  scalar: tf.Scalar;

  constructor() {
    this.scalar = tf.scalar(10);
  }

  async _getResults(input: number[][], config: Config) {
    const modelPath = path.resolve(__dirname, `../../../models/${config.root}/${config.model}/model.json`);
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    const tensor2d = tf.tensor2d(input, [input.length, input[0].length]).div(this.scalar);
    const tensor = model.predict(tensor2d) as tf.Tensor<tf.Rank>;
    return tensor.mul(10);
  }

  async train(input: number[][], output: number[], config: Config) {
    const {
      root,
      windowSize,
      epochs,
      lstmLayers,
      learningRate,
      inputLayerNeurons,
      rnnInputLayerFeatures,
      rnnOutputNeurons,
      outputLayerNeurons
    } = config;
    const inputLayerShape = windowSize;
    const rnnInputLayerTimeSteps = inputLayerNeurons / rnnInputLayerFeatures;
    const rnnInputShape = [rnnInputLayerFeatures, rnnInputLayerTimeSteps];
    const rnnBatchSize = windowSize;
    const outputLayerShape = rnnOutputNeurons;

    const model = tf.sequential();
    const xs = tf.tensor2d(input, [input.length, input[0].length]).div(this.scalar);
    const ys = tf.tensor2d(output, [output.length, 1]).reshape([output.length, 1]).div(this.scalar);
    model.add(tf.layers.dense({ units: inputLayerNeurons, inputShape: [inputLayerShape] }));
    model.add(tf.layers.reshape({ targetShape: rnnInputShape }));

    const cell = [];
    for (let i = 0; i < lstmLayers; i++) {
      cell.push(tf.layers.lstmCell({ units: rnnOutputNeurons }));
    }

    model.add(tf.layers.rnn({ cell, inputShape: rnnInputShape, returnSequences: false }));
    model.add(tf.layers.dense({ units: outputLayerNeurons, inputShape: [outputLayerShape] }));
    model.compile({ optimizer: tf.train.adam(learningRate), loss: 'meanSquaredError' });

    const history = await model.fit(xs, ys, {
      batchSize: rnnBatchSize,
      epochs,
      callbacks: {
        onEpochEnd: async (epoch, log) => console.log(epoch, log)
      }
    });

    const timestamp = new Date().getTime();
    const modelPath = `file://./models/${root}/${timestamp}`;
    if (!fs.existsSync(MODELS_PATH)) fs.mkdirSync(MODELS_PATH);
    if (!fs.existsSync(`${MODELS_PATH}/${root}`)) fs.mkdirSync(`${MODELS_PATH}/${root}`);
    await model.save(modelPath);

    return { model, history };
  }

  async predict(input: number[][], config: Config) {
    const results = await this._getResults(input, config);
    if (results) return [...results.dataSync()];
  }
}
