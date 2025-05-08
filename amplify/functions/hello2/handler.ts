export const handler = async (): Promise<string> => {
    const apiGatewayResponse = {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from hello2 lambda function!" })
    };
    
    // For GraphQL, return just the message
    return JSON.parse(apiGatewayResponse.body).message;
  };