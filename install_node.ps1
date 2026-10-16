$nodeDir = "C:\Users\Student\AppData\Local\Programs\nodejs"
if (-not (Test-Path $nodeDir)) { New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null }
$zipPath = "C:\Users\Student\AppData\Local\Temp\node.zip"
Write-Host "Downloading portable Node.js..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip" -OutFile $zipPath
Write-Host "Extracting Node.js..."
Expand-Archive -Path $zipPath -DestinationPath "C:\Users\Student\AppData\Local\Programs" -Force
$extracted = "C:\Users\Student\AppData\Local\Programs\node-v20.18.0-win-x64"
if (Test-Path $extracted) {
    robocopy $extracted $nodeDir /E /MOVE /NFL /NDL /NJH /NJS
}
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

# Add to user PATH permanently
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$nodeDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$nodeDir;$userPath", "User")
}
Write-Host "Node.js portable installation complete!"
& "$nodeDir\node.exe" -v
& "$nodeDir\npm.cmd" -v
