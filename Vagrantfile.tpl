Vagrant.configure("2") do |config|

  config.vm.define "vpn" do |vpn|
    vpn.vm.box = "ubuntu/trusty64"
    vpn.vm.hostname = "vaguebox-vpn"
    vpn.vm.network :public_network, bridge: "en0"
    vpn.vm.network :private_network, ip: "192.168.50.0", netmask: "255.0.0.0", 
      virtualbox__intnet: "ctfgameint"
    vpn.vm.network "forwarded_port", guest: 1194, host: 1194
    vpn.vm.provision "file", source: "./vpn_networking.part", destination: "vpn_networking.part"
    vpn.vm.provision "file", source: "./vpnserv.conf", destination: "vpnserv.conf"
    vpn.vm.provision "shell", path: "config_certauth.sh"
  end

  <% _.each( boxesList, function( ctfBox ) { %> 
  config.vm.define "<%= ctfBox.name %>" do |<%= ctfBox.name %>|
    <%= ctfBox.name %>.vm.box = "ubuntu/trusty64"
    <%= ctfBox.name %>.vm.hostname = "<%= ctfBox.name %>"
    <%= ctfBox.name %>.vm.network :private_network, ip: "<%= ctfBox.ip %>", netmask: "255.0.0.0", 
      virtualbox__intnet: "ctfgameint"
  end 
  <% } ); %>

end
