Run:
```bash
./build/buildGameEnv
```

This collects all player information before building the respective virtualized machines and virtual network. It also configures the VPN, etc. 

Activate said virtual environment with:
```bash
vagrant up
```

Then run the score bot (Gamebot) with
```bash
node Gamebot.js
```
