#!/bin/bash

chmod +x *.sh

setup_path=$(pwd)

cd $setup_path
./00_install_node_modules.sh
wait

cd $setup_path
./10_create_run_script.sh
wait

cd $setup_path
./20_create_auto_startup.sh
wait

./30_update_firewall.sh
wait

echo ""
echo "Done - reboot to take effect!"
echo ""
read -n 1 -s -r -p "Press any key to reboot..."

sudo reboot





