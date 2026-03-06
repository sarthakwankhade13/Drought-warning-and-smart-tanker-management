# First login to get token
$loginBody = @{
    email = "nagpur@gmail.com"
    password = "ngp123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"

Write-Host "Login successful!"
Write-Host "User: $($loginResponse.user.username)"
Write-Host "Village ID: $($loginResponse.user.village_id)"
Write-Host "Village: $($loginResponse.user.village.name)"
Write-Host ""

# Get rainfall data
$token = $loginResponse.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$villageId = $loginResponse.user.village_id
Write-Host "Fetching rainfall data for village ID: $villageId"

try {
    $rainfallResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/data/rainfall/$villageId" -Method Get -Headers $headers
    Write-Host "Rainfall records found: $($rainfallResponse.Count)"
    
    if ($rainfallResponse.Count -gt 0) {
        Write-Host ""
        Write-Host "Sample records:"
        $rainfallResponse | Select-Object -First 5 | ForEach-Object {
            Write-Host "  Date: $($_.record_date) | Rainfall: $($_.rainfall_mm)mm | Historical: $($_.is_historical)"
        }
    }
} catch {
    Write-Host "Error fetching rainfall data: $_"
}
