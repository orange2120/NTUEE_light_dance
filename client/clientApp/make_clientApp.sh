cd /home/pi/NTUEE_light_dance/client/clientApp/
sudo pm2 delete 0
sudo pm2 start pm2_startup.sh
sudo pm2 save
echo "FINISH"
