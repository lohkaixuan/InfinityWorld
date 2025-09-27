# AWS Bedrock Setup Guide for BizLocate

## Current Configuration Status

### ✅ What's Already Configured
- **Lambda Function**: `bedrockChat` with proper IAM permissions
- **IAM Permissions**: `bedrock:InvokeModel` permission granted
- **API Gateway**: REST endpoint configured
- **Model**: Updated to use Claude 3.5 Sonnet (more reliable)

### 🔧 Configuration Details

#### Lambda Function Settings
- **Runtime**: Node.js 18.x
- **Timeout**: 25 seconds
- **Memory**: Default (128MB) - consider increasing to 256MB for better performance
- **Region**: us-east-1 (primary), ap-southeast-1 (secondary)

#### Bedrock Model Configuration
- **Model**: `anthropic.claude-3-5-sonnet-20241022-v2:0`
- **Max Tokens**: 1000
- **Temperature**: 0.7
- **Format**: Anthropic Claude format

## Required AWS Services Setup

### 1. Enable Bedrock in AWS Console
```bash
# Navigate to AWS Bedrock Console
# Go to: https://console.aws.amazon.com/bedrock/
# Click "Get started" or "Enable Bedrock"
# Accept the terms and conditions
```

### 2. Verify Model Access
The following models should be available in us-east-1:
- ✅ `anthropic.claude-3-5-sonnet-20241022-v2:0`
- ✅ `anthropic.claude-3-haiku-20240307-v1:0` (faster, cheaper)
- ✅ `amazon.titan-text-express-v1` (Amazon's model)

### 3. IAM Permissions Required
Your Lambda execution role needs these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    }
  ]
}
```

## Testing Your Setup

### 1. Test Lambda Function Locally
```bash
# Test the function with a sample payload
curl -X POST https://your-api-gateway-url/api/bedrock-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me analyze a location for a restaurant?"}'
```

### 2. Check CloudWatch Logs
- Navigate to CloudWatch Console
- Go to Log Groups: `/aws/lambda/bedrockChat`
- Check for any error messages

### 3. Verify Bedrock Access
```bash
# Test Bedrock access using AWS CLI
aws bedrock list-foundation-models --region us-east-1
```

## Troubleshooting Common Issues

### Issue 1: Access Denied
**Error**: `AccessDeniedException`
**Solution**: 
- Enable Bedrock in AWS Console
- Verify IAM permissions
- Check if model is available in your region

### Issue 2: Model Not Available
**Error**: `ModelNotAccessibleException`
**Solution**:
- Use a different model (Claude 3.5 Haiku is more widely available)
- Check model availability in your region
- Update model ID in Lambda function

### Issue 3: Timeout Issues
**Error**: Function timeout
**Solution**:
- Increase Lambda timeout to 30 seconds
- Increase memory allocation to 256MB
- Optimize prompt length

## Environment Variables

Set these in your Lambda function:
```bash
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
MAX_TOKENS=1000
TEMPERATURE=0.7
```

## Cost Optimization

### Model Selection by Use Case
- **Claude 3.5 Sonnet**: Best quality, higher cost
- **Claude 3.5 Haiku**: Good quality, lower cost
- **Amazon Titan**: Basic tasks, lowest cost

### Usage Monitoring
- Monitor usage in AWS Cost Explorer
- Set up billing alerts
- Consider using provisioned throughput for high-volume usage

## Next Steps

1. **Deploy the updated Lambda function**
2. **Test the API endpoint**
3. **Monitor CloudWatch logs**
4. **Optimize model parameters based on usage**
5. **Set up monitoring and alerting**

## Support Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude 3.5 Model Guide](https://docs.anthropic.com/claude/docs)
- [Lambda Function Configuration](https://docs.aws.amazon.com/lambda/)
