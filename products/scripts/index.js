const { DynamoDB } = require("@aws-sdk/client-dynamodb");

(async () => {
  const client = new DynamoDB({ region: "us-west-2" });
  try {
    const results = await client.listTables({});
    console.log(results.TableNames.join("\n"));
  } catch (err) {
    console.error(err);
  }
})();
