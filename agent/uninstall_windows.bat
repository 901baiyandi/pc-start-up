@echo off
chcp 65001 >nul
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PC Start-Up Ajan.lnk" >nul 2>&1
netsh advfirewall firewall delete rule name="PC Start-Up Ajan" >nul 2>&1
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='pythonw.exe'\" | Where-Object { $_.CommandLine -like '*agent.py*' } | Invoke-CimMethod -MethodName Terminate | Out-Null"
echo Ajan kaldirildi.
pause
