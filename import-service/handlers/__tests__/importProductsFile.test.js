import importProductsFile from '../importProductsFile';
import params from '../../__mocks__/newFile.json';
import AWS from 'aws-sdk-mock';

describe('ImportProductsFile', () => {
  test('should return signed url', async () => {
    AWS.mock('S3', 'getSignedUrl', () => 'result.url');

    const successResponse = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify('result.url')
    }

    const response = await importProductsFile(params);
    expect(response).toEqual(successResponse);
  });
});
