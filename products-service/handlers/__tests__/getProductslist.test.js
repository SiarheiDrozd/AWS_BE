import getProductsList from '../getProductsList';
import getProductMocks from '../../__mocks__/products.mjs';

describe('Get products-service list', () => {
  test('should return objects array', async () => {
    const products = await getProductMocks();
    const successResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json'
      },
      body: JSON.stringify(products)
    };

    getProductsList().then((response) => {
      expect(response).toEqual(successResponse);
    });
  });
});
