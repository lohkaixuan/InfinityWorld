# Bedrock Deployment Script for BizLocate
# This script deploys the updated Bedrock configuration

Write-Host "🚀 Deploying Bedrock Configuration for BizLocate..." -ForegroundColor Green

# Check if Amplify CLI is installed
Write-Host "`n1. Checking Amplify CLI..." -ForegroundColor Yellow
try {
    $amplifyVersion = amplify --version
    Write-Host "✅ Amplify CLI found: $amplifyVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Amplify CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g @aws-amplify/cli" -ForegroundColor Cyan
    exit 1
}

# Check AWS credentials
Write-Host "`n2. Checking AWS credentials..." -ForegroundColor Yellow
try {
    $awsIdentity = aws sts get-caller-identity
    Write-Host "✅ AWS credentials configured" -ForegroundColor Green
    $identity = $awsIdentity | ConvertFrom-Json
    Write-Host "   Account: $($identity.Account)" -ForegroundColor Gray
    Write-Host "   User: $($identity.Arn)" -ForegroundColor Gray
} catch {
    Write-Host "❌ AWS credentials not configured. Please run:" -ForegroundColor Red
    Write-Host "aws configure" -ForegroundColor Cyan
    exit 1
}

# Deploy the function
Write-Host "`n3. Deploying Lambda function..." -ForegroundColor Yellow
try {
    amplify push --yes
    Write-Host "✅ Lambda function deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

# Test the deployment
Write-Host "`n4. Testing Bedrock configuration..." -ForegroundColor Yellow
Write-Host "Running test script..." -ForegroundColor Gray
try {
    node test-bedrock.js
    Write-Host "✅ Bedrock test completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Bedrock test had issues. Check the output above." -ForegroundColor Yellow
}

# Get API endpoint
Write-Host "`n5. Getting API endpoint..." -ForegroundColor Yellow
try {
    $apiUrl = amplify status --json | ConvertFrom-Json | Select-Object -ExpandProperty api
    if ($apiUrl) {
        Write-Host "✅ API Gateway endpoint configured" -ForegroundColor Green
        Write-Host "   Endpoint: $($apiUrl.infinityworldapi.GraphQLAPIEndpoint)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Could not retrieve API endpoint. Check amplify status" -ForegroundColor Yellow
}

Write-Host "`n🎉 Bedrock setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Test your API endpoint with a sample request" -ForegroundColor White
Write-Host "2. Check CloudWatch logs for any errors" -ForegroundColor White
Write-Host "3. Update your frontend to use the new API" -ForegroundColor White
Write-Host "`nFor troubleshooting, see: bedrock-setup-guide.md" -ForegroundColor Gray
