import { getProductMocks } from '../mocks/products.js';

const getProductsList = async () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'content-type': 'application/json'
  }
  try {
    const products = await getProductMocks();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(products)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: 'request failed'
    };
  }
};

export default getProductsList;
