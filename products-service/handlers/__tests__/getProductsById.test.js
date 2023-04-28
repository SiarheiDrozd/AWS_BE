import getProductsById from '../getProductsById';
import getProductMocks from '../../__mocks__/products.mjs';

describe('Get product by Id', () => {
  test('should return object', async () => {
    const products = await getProductMocks();
    const successResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json'
      },
      body: JSON.stringify({product: products[0]})
    };

    getProductsById({pathParameters: {productId: products[0].id}})
      .then((response) => {
        expect(response).toEqual(successResponse);
      });
  });
  test('should return error', () => {
    const failedResponse = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json'
      },
      body: 'Something went wrong. TypeError: Cannot read properties of undefined (reading \'pathParameters\')',
    };

    getProductsById().then((response) => {
      expect(response).toEqual(failedResponse);
    });
  });
});
