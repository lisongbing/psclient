echo off
set proto_dir=%~dp0
for /f "delims=" %%i in ('dir /b *.temp') do (
	copy %%i %proto_dir%\..\client\assets\resources\proto\%%~ni.proto
	del %%i 
)
copy %proto_dir%\ProtoMap.js %proto_dir%\..\client\assets\scripts\network
del %proto_dir%\ProtoMap.js 
pause