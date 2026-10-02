# Healthcare Collective - Windows Setup Script
# Run: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "Healthcare Collective - Setup Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Cyan
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Install from: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking for npm..." -ForegroundColor Cyan
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating .env.local..." -ForegroundColor Cyan
if (-Not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✓ .env.local created (edit with your Supabase and email credentials)" -ForegroundColor Green
} else {
    Write-Host "✓ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env.local with your Supabase and email credentials"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. Visit http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For deployment, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
