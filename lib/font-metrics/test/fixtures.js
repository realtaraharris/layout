'use strict';

const helveticaNormal20 = {
  typeStyle: {
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 20,
    origin: 'baseline'
  },
  expectedMeasurements: {
    capHeight: 0.4,
    baseline: 0,
    xHeight: 0.3,
    descent: -0.075,
    bottom: -0.25,
    ascent: 0.375,
    title: 0.375,
    top: 0.4,
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
    origin: 'baseline'
  },
  expectedMeasurements: {
    capHeight: 0.37,
    baseline: 0,
    xHeight: 0.265,
    descent: -0.1,
    bottom: -0.25,
    ascent: 0.36,
    title: 0.36,
    top: 0.385,
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 100
  }
};

module.exports = {helveticaNormal20, helveticaNormal100};
