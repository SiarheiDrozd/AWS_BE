import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import crypto from 'crypto';

const catalogBatchProcess = async (event) => {
  console.log(event);
  const dynamoClient = new DynamoDBClient({});
  const records = event.Records.map(record => record.body);
  const sns = new AWS.SNS({region: 'us-east-1'});

  try {
    const tableStock = process.env.DB_STOCK;
    const tableProducts = process.env.DB_PRODUCTS;
    const sendSns = async (itemId, parsedItem) => {
      const snsParams = {
        Message: `New record added: ${itemId}`,
        MessageAttributes: {
          Count: {
            DataType: 'String',
            StringValue: parsedItem.count === '0' ? 'empty' : 'stock'
          }
        },
        TopicArn: 'arn:aws:sns:us-east-1:489669634691:createProductTopic'
      };

      const result = await sns.publish(snsParams).promise();

      console.log(result);

      return result;
    };

    const {stock, products} = records.reduce((acc, item) => {
      const itemId = crypto.randomUUID();
      const parsedItem = JSON.parse(item);

      acc.stock.push({
        PutRequest: {
          Item: {
            id: {S: itemId},
            count: {N: parsedItem.count}
          }
        }
      });

      acc.products.push({
        PutRequest: {
          Item: {
            id: {S: itemId},
            title: {S: parsedItem.title},
            description: {S: parsedItem.description},
            price: {N: parsedItem.price}
          }
        }
      });

      sendSns(itemId, parsedItem);

      return acc;
    }, {stock: [], products: []});

    const commandBatchWrite = new BatchWriteItemCommand({
      RequestItems: {
        [tableStock]: stock,
        [tableProducts]: products
      }
    });

    return await dynamoClient.send(commandBatchWrite);
  } catch (err) {
    console.log(err);
  }
};

export default catalogBatchProcess;
