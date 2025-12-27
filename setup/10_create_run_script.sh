#!/bin/bash

cd ../src
c_dir=$(pwd)

echo "========================================"
echo " Create script file                     "
echo "========================================"

cat<<EOF > "$c_dir/run.sh"
#!/bin/bash
clear
cd $c_dir
npm run prod
EOF

chmod +x $c_dir/run.sh




