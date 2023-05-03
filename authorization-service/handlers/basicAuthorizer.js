const generatePolicy = (effect, resource) => {
  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:invoke',
      Effect: effect,
      Resource: resource
    }]
  };
};

const generateResponse = (effect, resource, principalId) => {
  return {
    principalId: principalId,
    policyDocument: generatePolicy(effect, resource)
  };
};
const basicAuthorizer = async (event) => {
  console.log(event);

  const { headers, methodArn } = event;
  const principalId = 'test';

  if (!headers.Authorization) {
    console.log('Unauthorized request');

    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'You are not authorized to access this resource.' })
    };
  }

  const { userName, password } = new Buffer.from(headers.Authorization.split(' ')[1],
    'base64').toString().split(':');

  const response = password === process.env[userName] ?
    generateResponse('Allow', methodArn, principalId) :
    generateResponse('Deny', methodArn, principalId);

  console.log(JSON.stringify(response));

  return response;
};

export default basicAuthorizer;
