#!/bin/sh
proto_dir=`pwd`
for FILE in `ls`
    do
    if [ "${FILE##*.}"x = "temp"x ];then
        # echo $FILE
        cp -r $FILE ${proto_dir}/../client/assets/resources/proto/${FILE%.*}.proto
        rm -rf $FILE
        # python parse_xls_2_csv.py $FILE ${FILE%.*}
        # python parse_xls_2_json.py $FILE ${FILE%.*}
    else
        echo "echo end...."
    fi
    done

cp -r ${proto_dir}/ProtoMap.js ${proto_dir}/../client/assets/scripts/network
rm -rf ${proto_dir}/ProtoMap.js