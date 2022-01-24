#!/bin/bash

python _hu_apk_2_mf.py macandroid

export hotup_pause=false

source ./_hu_hotup.sh

export HOT_UPDATE_VERSION_PATH=./hotupdate/$VERSION

echo $HOT_UPDATE_VERSION_PATH

export ASSETS_DIR=./assets

cp $HOT_UPDATE_VERSION_PATH/project.manifest $ASSETS_DIR/resources/
cp $HOT_UPDATE_VERSION_PATH/version.manifest $ASSETS_DIR/resources/
