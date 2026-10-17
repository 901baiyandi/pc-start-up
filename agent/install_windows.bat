@echo off
chcp 65001 >nul
title Arise Ajan Kurulumu

:: Yonetici izni kontrolu (guvenlik duvari kurali icin gerekli)
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Yonetici izni isteniyor...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

where pythonw >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Python bulunamadi. https://www.python.org adresinden kurun
    echo        ve kurulumda "Add python.exe to PATH" kutusunu isaretleyin.
    pause
    exit /b 1
)

echo [1/3] Guvenlik duvari kurali ekleniyor (TCP 5757)...
netsh advfirewall firewall delete rule name="PC Start-Up Ajan" >nul 2>&1
netsh advfirewall firewall delete rule name="Arise Ajan" >nul 2>&1
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PC Start-Up Ajan.lnk" >nul 2>&1
netsh advfirewall firewall add rule name="Arise Ajan" dir=in action=allow protocol=TCP localport=5757 profile=private,domain >nul

echo [2/3] Windows acilisinda otomatik baslatma ayarlaniyor...
powershell -NoProfile -Command ^
  "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Startup')+'\Arise Ajan.lnk');" ^
  "$s.TargetPath=(Get-Command pythonw).Source;" ^
  "$s.Arguments='\"%~dp0agent.py\"';" ^
  "$s.WorkingDirectory='%~dp0';" ^
  "$s.Save()"

echo [3/3] Ajan baslatiliyor...
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='pythonw.exe'\" | Where-Object { $_.CommandLine -like '*agent.py*' } | Invoke-CimMethod -MethodName Terminate | Out-Null"
start "" pythonw "%~dp0agent.py"
timeout /t 3 >nul

echo.
echo ============================================================
echo  Kurulum tamam! Asagidaki bilgileri telefondaki uygulamaya girin:
echo ============================================================
type "%~dp0config.json"
echo.
echo  Ag kartlari (MAC adresi = MacAddress, ETHERNET olani kullan):
powershell -NoProfile -Command "Get-NetAdapter -Physical | Format-Table Name, MacAddress, Status, LinkSpeed -AutoSize"
echo  IP adresleri:
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Format-Table InterfaceAlias, IPAddress -AutoSize"
echo.
pause
