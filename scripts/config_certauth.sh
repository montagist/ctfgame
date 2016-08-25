apt-get --yes --force-yes install openvpn bridge-utils
apt-get --yes --force-yes install easy-rsa

cat vpn_networking.part >> /etc/network/interfaces
/etc/init.d/networking restart

cd /usr/share/easy-rsa 
rmdir keys
mkdir keys
source ./vars
./clean-all
./build-ca		# How can I bypass interactivity here?
./build-dh
./pkitool --initca
./build-key-server --batch server


./build-key --batch player1
./build-key --batch player2

openvpn /home/vagrant/vpnserv.conf