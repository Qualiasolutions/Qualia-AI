# PowerShell script to run the development server
Write-Host "Starting Qualia Solutions development server..." -ForegroundColor Cyan
try {
    cd $PSScriptRoot
    npm run dev
}
catch {
    Write-Host "Error starting development server: $_" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
}
finally {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Development server exited with code $LASTEXITCODE" -ForegroundColor Yellow
        Write-Host "Press any key to exit..."
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    }
} 