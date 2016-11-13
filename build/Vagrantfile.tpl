Vagrant.configure("2") do |config|

  config.vm.define "vpn" do |vpn|
    vpn.vm.box = "ubuntu/trusty64"
    vpn.vm.hostname = "vaguebox-vpn"
    vpn.vm.network :public_network, bridge: "en0: Wi-Fi (AirPort)"
    vpn.vm.network :private_network, ip: "192.168.50.0", netmask: "255.0.0.0", 
      virtualbox__intnet: "ctfgameint"
    vpn.vm.network "forwarded_port", guest: 1194, host: 1194
    vpn.vm.provision "file", source: "./scripts/vpn_networking.part", destination: "vpn_networking.part"
    vpn.vm.provision "file", source: "./scripts/vpnserv.conf", destination: "vpnserv.conf"
    vpn.vm.provision "file", source: "./scripts/bridge-start.sh", destination: "bridge-start.sh"
    vpn.vm.provision "file", source: "./scripts/config_certauth.sh", destination: "config_certauth.sh"
    vpn.vm.provision "file", source: "./scripts/pkgkeys.sh", destination: "pkgkeys.sh"
    vpn.vm.provision "file", source: "./scripts/install_scorebot_env.sh", destination: "install_scorebot_env.sh"
    vpn.vm.provision "shell", inline: "./install_scorebot_env.sh && ./config_certauth.sh"
    vpn.trigger.after :up do
    	run "pkgkeys.sh"
	end
  end

  <% _.each( boxesList, function( ctfBox ) { %> 
  config.vm.define "<%= ctfBox.name %>" do |<%= ctfBox.name %>|
    <%= ctfBox.name %>.vm.box = "ubuntu/trusty64"
    <%= ctfBox.name %>.vm.hostname = "<%= ctfBox.name %>"
    <%= ctfBox.name %>.vm.network :private_network, ip: "<%= ctfBox.ip %>", netmask: "255.0.0.0", 
      virtualbox__intnet: "ctfgameint"
    <%= ctfBox.name %>.vm.customize ["modifyvm", :id, "--nictrace1", "on"]
    <%= ctfBox.name %>.vm.customize ["modifyvm", :id, "--nictracefile1", "<%= ctfBox.name %>.pcap"]
  end 
  <% } ); %>

end