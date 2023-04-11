import getProductsList from "../getProductsList";
import { getProductMocks } from '../../mocks/products'
describe('Get products list', () => {
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
    }

    getProductsList().then((response) => {
      expect(response).toEqual(successResponse);
    })
  });
});
