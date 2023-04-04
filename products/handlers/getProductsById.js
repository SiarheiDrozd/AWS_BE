import { getProductMocks } from '../mocks/products.js';

const getProductsById = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'content-type': 'application/json'
  }
  try {
    const products = await getProductMocks();
    const { productId } = event.pathParameters;
    const product = products.find(item => item.id === productId);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({product: product}),
    };
  } catch (err) {
    return  {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({product: product}),
    };
  }
}

export default getProductsById;
