import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { getProductMocks } from "../__mocks__/products.mjs";

const fillTable = async () => {
  console.log(process.env.DB_STOCK,process.env.DB_PRODUCTS);

  const mocks = await getProductMocks();
  const dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  mocks.forEach(item => {
    try {
      const itemId = uuid();

      dynamo.put({
        TableName: 'stock',
        Item: {
          id: itemId,
          count: item.count
        }
      },(result) => {
        console.log(result);
      });

      dynamo.put({
        TableName: 'products',
        Item: {
          id: itemId,
          count: item.count,
          title: item.title,
          description: item.description,
          price: item.price
        }
      },(result) => {
        console.log(result);
      });
    } catch (err) {
      console.log(err);
    }

  })
}

fillTable();
