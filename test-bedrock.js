#!/usr/bin/env node

/**
 * Bedrock Configuration Test Script
 * Tests AWS Bedrock connectivity and model access
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const REGION = process.env.AWS_REGION || 'ap-southeast-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

console.log('🔍 Testing AWS Bedrock Configuration...\n');

// Test 1: Check AWS Credentials
console.log('1. Checking AWS Credentials...');
try {
  const client = new BedrockRuntimeClient({ region: REGION });
  console.log(`✅ AWS SDK initialized for region: ${REGION}`);
} catch (error) {
  console.log(`❌ AWS SDK initialization failed: ${error.message}`);
  process.exit(1);
}

// Test 2: Test Bedrock Model Invocation
console.log('\n2. Testing Bedrock Model Invocation...');
async function testBedrockModel() {
  try {
    const client = new BedrockRuntimeClient({ region: REGION });
    
    const input = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: 'Hello! Please respond with "Bedrock is working correctly" if you can see this message.'
        }]
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiText = responseBody.content?.[0]?.text || 'No response.';
    
    console.log(`✅ Bedrock model response: ${aiText}`);
    console.log(`✅ Model ID: ${MODEL_ID}`);
    console.log(`✅ Region: ${REGION}`);
    
  } catch (error) {
    console.log(`❌ Bedrock model test failed:`);
    console.log(`   Error: ${error.name}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    
    if (error.name === 'AccessDeniedException') {
      console.log('\n💡 Solution: Enable Bedrock in AWS Console and check IAM permissions');
    } else if (error.name === 'ModelNotAccessibleException') {
      console.log('\n💡 Solution: Try a different model or region');
    } else if (error.name === 'ValidationException') {
      console.log('\n💡 Solution: Check model ID format and request body');
    }
  }
}

// Test 3: Check Alternative Models
console.log('\n3. Checking Alternative Models...');
const alternativeModels = [
  'anthropic.claude-3-haiku-20240307-v1:0',
  'amazon.titan-text-express-v1',
  'anthropic.claude-instant-v1'
];

async function testAlternativeModels() {
  const client = new BedrockRuntimeClient({ region: REGION });
  
  for (const modelId of alternativeModels) {
    try {
      const input = {
        modelId: modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 10,
          temperature: 0.1,
          messages: [{
            role: 'user',
            content: 'Hi'
          }]
        })
      };

      const command = new InvokeModelCommand(input);
      await client.send(command);
      console.log(`✅ Model ${modelId} is accessible`);
    } catch (error) {
      console.log(`❌ Model ${modelId} failed: ${error.name}`);
    }
  }
}

// Run all tests
async function runTests() {
  await testBedrockModel();
  await testAlternativeModels();
  
  console.log('\n📋 Summary:');
  console.log('If you see ✅ for the main model, your Bedrock setup is working!');
  console.log('If you see ❌, check the AWS Console and IAM permissions.');
  console.log('\nNext steps:');
  console.log('1. Deploy your Lambda function: amplify push');
  console.log('2. Test the API endpoint with your frontend');
  console.log('3. Monitor CloudWatch logs for any issues');
}

runTests().catch(console.error);
