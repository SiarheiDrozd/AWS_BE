'use strict';
const products = require('./source/products.json');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}

exports.getProductsList = async () => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(await products)
  };
};

exports.getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  const product = await products.find(item => item.id === productId);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({product: product}),
  };
};
