# Deploy Lambda function directly with AWS CLI

Write-Host "🚀 Deploying Lambda function..." -ForegroundColor Green

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "lambda-deployment.zip") { Remove-Item "lambda-deployment.zip" }

# Create a temporary package.json for Lambda
@"
{
  "name": "bedrockchatlambda-prod",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.893.0"
  }
}
"@ | Out-File -FilePath "lambda-package.json" -Encoding UTF8

# Install dependencies in a temp folder
New-Item -ItemType Directory -Force -Path "lambda-temp"
Copy-Item "api/bedrock-chat.js" "lambda-temp/"
Copy-Item "lambda-package.json" "lambda-temp/package.json"

Push-Location "lambda-temp"
npm install --production
Pop-Location

# Create ZIP file
Compress-Archive -Path "lambda-temp/*" -DestinationPath "lambda-deployment.zip" -Force

# Create Lambda function
$functionName = "infinityworld-bedrock-chat"

Write-Host "☁️ Creating Lambda function..." -ForegroundColor Yellow
aws lambda create-function `
  --function-name $functionName `
  --runtime nodejs18.x `
  --role arn:aws:iam::979237821101:role/lambda-execution-role `
  --handler bedrock-chat.handler `
  --zip-file fileb://lambda-deployment.zip `
  --timeout 30 `
  --memory-size 256

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Lambda function created successfully!" -ForegroundColor Green
    
  # Create API Gateway
  Write-Host "🌐 Creating API Gateway..." -ForegroundColor Yellow
  $apiId = (aws apigateway create-rest-api --name "infinityworldapi" --query 'id' --output text)
    
  if ($apiId) {
    Write-Host "✅ API Gateway created: $apiId" -ForegroundColor Green
    Write-Host "📋 Next: Configure API Gateway in AWS Console" -ForegroundColor Cyan
  }
}
else {
  Write-Host "⚠️ Function might already exist. Updating..." -ForegroundColor Yellow
  aws lambda update-function-code --function-name $functionName --zip-file fileb://lambda-deployment.zip
}

# Cleanup
Remove-Item -Recurse -Force "lambda-temp"
Remove-Item "lambda-package.json"
Remove-Item "lambda-deployment.zip"

Write-Host "✅ Deployment complete!" -ForegroundColor Green