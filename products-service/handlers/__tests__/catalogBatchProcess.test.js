import catalogBatchProcess from '../catalogBatchProcess';
import sqsObject from '../../__mocks__/sqsObject.json';

const AWS = require('aws-sdk');

describe('catalogBatchProcess', () => {
  beforeEach(async function () {

  });

  test('should trigger SNS', async () => {
    const spy = jest.spyOn(AWS, 'SNS').mockResolvedValue(() => {
      return function publish() {
        return 'test';
      };
    });

    expect(spy).toHaveBeenCalled();

    const result = catalogBatchProcess(sqsObject);
    expect(result).toEqual('test-message');
  });
});
