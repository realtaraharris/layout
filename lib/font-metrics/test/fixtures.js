'use strict';

const helveticaNormal20 = {
  typeStyle: {
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 20,
    scaleFactor: 1,
    origin: 'baseline'
  },
  expectedMeasurements: {
    capHeight: 0.8,
    baseline: 0,
    xHeight: 0.6,
    descent: -0.15,
    bottom: -0.5,
    ascent: 0.75,
    title: 0.75,
    top: 0.8,
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 20
  }
};

const helveticaNormal100 = {
  typeStyle: {
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 100,
    scaleFactor: 1,
    origin: 'baseline'
  },
  expectedMeasurements: {
    capHeight: 0.74,
    baseline: 0,
    xHeight: 0.53,
    descent: -0.2,
    bottom: -0.5,
    ascent: 0.72,
    title: 0.72,
    top: 0.77,
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 100
  }
};

const timesNormal100 = {
  typeStyle: {
    fontFamily: 'times',
    fontWeight: 'normal',
    fontSize: 100,
    scaleFactor: 1,
    origin: 'baseline'
  },
  expectedMeasurements: {
    capHeight: 0.68,
    baseline: 0,
    xHeight: 0.45,
    descent: -0.21,
    bottom: -0.5,
    ascent: 0.69,
    title: 0.69,
    top: 0.75,
    fontFamily: 'times',
    fontWeight: 'normal',
    fontSize: 100
  }
};

module.exports = {helveticaNormal20, helveticaNormal100, timesNormal100};
