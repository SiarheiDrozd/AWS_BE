import AWS from "aws-sdk";

const query = async (table, id) => {
  const dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
  const queryParams = {
    TableName: table,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id }
  }
  return dynamo.query(queryParams).promise();
}

const getProductsById = async (event) => {
  console.log(event.queryStringParameters);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'content-type': 'application/json'
  }

  try {
    const { productId } = event.pathParameters;
    const products = await query('products', productId);
    const stock = await query('stock', productId);
    const product = {...products.Items[0], ...stock.Items[0]};

    if (!product) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: `Product with id = ${productId} not found`,
      }
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({product: product}),
    };
  } catch (err) {
    return  {
      statusCode: 500,
      headers: corsHeaders,
      body: 'Something went wrong. ' + err,
    };
  }
}

export default getProductsById;
