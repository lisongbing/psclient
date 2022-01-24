#!/bin/bash

python _hu_up_version.py true macandroid

source ./version_android.sh

python _hu_apk_1_Ver_gmver.py $VERSION
