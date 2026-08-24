@echo off
title Aplikasi Administrasi TU SMP Muslimin Cililin
color 1F

echo ================================================
echo   APLIKASI ADMINISTRASI TU SMP MUSLIMIN CILILIN
echo ================================================
echo.
echo [*] Memulai aplikasi...
echo.

cd /d "D:\Aplikasi Produksi\Administrasi TU SMP"

if not exist "package.json" (
    echo [ERROR] File package.json tidak ditemukan!
    echo Pastikan folder aplikasi sudah benar.
    echo.
    pause
    exit
)

echo [*] Menjalankan npm start...
echo.
echo ================================================
echo.

npm start

echo.
echo ================================================
echo [*] Aplikasi telah ditutup
echo ================================================
echo.
pause