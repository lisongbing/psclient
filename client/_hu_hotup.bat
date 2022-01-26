
if "$hotup_pause"=="" (
	set hotup_pause=true
)

python _hu_up_version.py false android
call %~dp0\_hu_version.bat

rem 设置热更新地址
rem relese http://hot.newenerg.cn/android/  
rem debug  https://recharge.xmhdgame.com/android/

set HOT_UPDATE_URL=http://119.23.235.127:80/

rem 生成热更新文件包
node _hu_version_generator.js -v %VERSION% -u %HOT_UPDATE_URL%


