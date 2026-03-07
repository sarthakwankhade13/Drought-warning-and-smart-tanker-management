# Test login
$body = @{
    email = "admin@water.gov"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Testing login..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "`n✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "User: $($response.user.username)" -ForegroundColor Cyan
    Write-Host "Role: $($response.user.role)" -ForegroundColor Cyan
    Write-Host "Token: $($response.token.Substring(0, 30))..." -ForegroundColor Cyan
    Write-Host "`nYou can now use this in your browser!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ LOGIN FAILED!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
