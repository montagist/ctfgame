# must rework to pull 192 ip address instead of internal 10.0 one
vpn_ip=$(vagrant ssh vpn -c "ip address show eth0 | grep 'inet ' | sed -e 's/^.*inet //' -e 's/\/.*$//'")

# grabs vpn setup keys
#scp -i .vagrant/machines/vpn/virtualbox/private_key vagrant@$vpn_ip:/remote/dir/foobar.txt /local/dir

# then must also sort, rename, group, zip, and email vagrant ssh keys from host