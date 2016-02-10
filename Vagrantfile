Vagrant.configure("2") do |config|
  config.vm.provision "shell", inline: "echo Hello"

  config.vm.define "vpn" do |vpn|
    vpn.vm.box = "ubuntu/trusty64"
    vpn.vm.hostname = "vaguebox-vpn"
    vpn.vm.network "public_network", bridge: "en0"
    vpn.vm.network "private_network", ip: "192.168.50.0",
      virtualbox__intnet: true
  end
  
  config.vm.define "player1box1" do |player1box1|
    player1box1.vm.box = "ubuntu/trusty64"
    player1box1.vm.hostname = "player1box1"
    player1box1.vm.network "private_network", ip: "192.168.77.1",
      virtualbox__intnet: true
  end 

  config.vm.define "player2box1" do |player2box1|
    player2box1.vm.box = "ubuntu/trusty64"
    player2box1.vm.hostname = "player2box1"
    player2box1.vm.network "private_network", ip: "192.168.77.2",
      virtualbox__intnet: true
  end

end
