import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { message } = JSON.parse(event.body);
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No message provided' })
      };
    }

    // Use Claude 3.5 Haiku - more reliable and cost-effective
    const input = {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: message
        }]
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiText = responseBody.content?.[0]?.text || 'No response.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: aiText })
    };
  } catch (err) {
    console.error('Bedrock Error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      region: process.env.AWS_REGION || 'ap-southeast-1'
    });
    
    // Provide more specific error messages
    let errorMessage = 'An error occurred while processing your request.';
    if (err.name === 'AccessDeniedException') {
      errorMessage = 'Access denied to Bedrock service. Please check IAM permissions.';
    } else if (err.name === 'ValidationException') {
      errorMessage = 'Invalid request format. Please check the input parameters.';
    } else if (err.name === 'ThrottlingException') {
      errorMessage = 'Request rate limit exceeded. Please try again later.';
    } else if (err.name === 'ModelNotAccessibleException') {
      errorMessage = 'The requested model is not available in this region.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: err.message,
        code: err.code || 'UNKNOWN_ERROR'
      })
    };
  }
};