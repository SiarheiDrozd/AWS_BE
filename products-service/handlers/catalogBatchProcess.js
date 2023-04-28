import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import crypto from 'crypto';

const catalogBatchProcess = async (event) => {
  console.log(event);
  const dynamoClient = new DynamoDBClient({});
  const records = event.Records.map(record => record.body);
  const sns = new AWS.SNS({region: 'us-east-1'});
  const snsParams = {
    Message: `New record added`,
    MessageAttributes: {
      Count: {
        DataType: 'String',
        StringValue: 'empty'
      }
    },
    TopicArn: 'arn:aws:sns:us-east-1:489669634691:createProductTopic'
  };

  try {
    const tableStock = process.env.DB_STOCK;
    const tableProducts = process.env.DB_PRODUCTS;

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

      snsParams.MessageAttributes.Count.StringValue = parsedItem.count ? 'stock' : 'empty';
      snsParams.Message = `New record added: ${itemId}`;
      sns.publish(snsParams).promise().then((err, data) => {
        console.log(err ? err : data);
      });

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
