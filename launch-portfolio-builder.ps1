$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$Url = "http://127.0.0.1:5173"

function Test-AppReady {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 1
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

if (-not (Test-AppReady)) {
  $command = "Set-Location -LiteralPath '$ProjectPath'; npm run dev -- --host 127.0.0.1 --port 5173"
  Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $command -WorkingDirectory $ProjectPath

  $deadline = (Get-Date).AddSeconds(30)
  while ((Get-Date) -lt $deadline) {
    if (Test-AppReady) {
      break
    }
    Start-Sleep -Milliseconds 500
  }
}

Start-Process $Url
