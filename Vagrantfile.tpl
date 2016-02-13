Vagrant.configure("2") do |config|
  config.vm.provision "shell", inline: "echo Hello"

  config.vm.define "vpn" do |vpn|
    vpn.vm.box = "ubuntu/trusty64"
    vpn.vm.hostname = "vaguebox-vpn"
    vpn.vm.network "public_network", bridge: "en0"
    vpn.vm.network "private_network", ip: "192.168.50.0",
      virtualbox__intnet: true
  end

  <% _.each( boxesList, function( ctfBox ) { %> 
  config.vm.define "<%= ctfBox.name %>" do |<%= ctfBox.name %>|
    player1box1.vm.box = "ubuntu/trusty64"
    player1box1.vm.hostname = "<%= ctfBox.name %>"
    player1box1.vm.network "private_network", ip: "<%= ctfBox.ip %>",
      virtualbox__intnet: true
  end 
  <% } ); %>

end
