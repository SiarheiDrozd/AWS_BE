'use strict';
const products = require('./source/products.json');

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        product: await products
      },
      null,
      2
    ),
  };
};
