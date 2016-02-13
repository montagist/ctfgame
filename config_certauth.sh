sudo apt-get --yes --force-yes install openvpn bridge-utils
sudo apt-get --yes --force-yes install easy-rsa

# How do I get vpn_networking.part onto the vpn machine?
cat vpn_networking.part >> /etc/network/interfaces
sudo /etc/init.d/networking restart

# https://help.ubuntu.com/community/OpenVPN
# https://openvpn.net/index.php/open-source/documentation/howto.html#numbering

sudo su
cd /usr/share/easy-rsa 
rmdir keys
mkdir keys
source ./vars
./clean-all
./build-ca		# How can I bypass interactivity here?
./build-dh

