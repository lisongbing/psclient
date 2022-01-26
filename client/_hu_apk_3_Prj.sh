#!/bin/bash

export PROJ_DIR=.
export BUILD_DIR=$PROJ_DIR/build/jsb-link/

source ./version_android.sh

version=$VERSION
echo $version
array=(${version//./ })
echo $array

export BUILD_VERSION=${array[0]}.${array[1]}
echo ===== $BUILD_VERSION

#rem 修改main.js
python _hu_apk_3_Prj_mainjs.py $BUILD_DIR $BUILD_VERSION android release



