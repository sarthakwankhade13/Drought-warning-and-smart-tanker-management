# Test Weather API Response
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQxNDI5MjAwfQ.example"

Write-Host "Testing Weather Forecast API..." -ForegroundColor Cyan
Write-Host ""

# Test with village ID 12 (Hinganghat)
$villageId = 12
$url = "http://localhost:5000/api/weather/forecast/$villageId"

Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "SUCCESS! Response received:" -ForegroundColor Green
    Write-Host ""
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. Backend server is running (npm start in backend folder)"
    Write-Host "2. You're logged in and have a valid token"
    Write-Host "3. Village ID exists in database"
}
