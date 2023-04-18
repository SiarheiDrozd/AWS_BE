import AWS from "aws-sdk";


const getProductsById = async (event) => {
  console.log(event.queryStringParameters);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }

  try {
    const dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
    const query = async (table, id) => {
      const queryParams = {
        TableName: table,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': id }
      }
      return dynamo.query(queryParams).promise();
    }

    const { productId } = event.pathParameters;
    const products = await query(process.env.DB_PRODUCTS, productId);
    const stock = await query(process.env.DB_STOCK, productId);
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
