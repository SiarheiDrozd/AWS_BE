import AWS from 'aws-sdk';

const getProductsList = async () => {
  const dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'content-type': 'application/json'
  };
  try {
    const products = await dynamo.scan({TableName: 'products'}).promise();
    const stock = await dynamo.scan({TableName: 'stock'}).promise();

    const resultList = products.Items.map(item => {
      return {
        ...item,
        ...stock.Items.find(stockItem => stockItem.id === item.id)
      };
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(resultList)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: 'Something went wrong. Error: ' + err,
    };
  }
};

export default getProductsList;
