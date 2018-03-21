# xennode
A quickly thrown together script to get Xenserver stats into a InfluxDB database

# Installation
To install you will need to have git and NodeJS/npm installed on your system. This code has been tested against a CentOS box but should work on Windows and maybe Mac too.
``` 
git clone https://github.com/adamxp12/xennode.git
cd xennode
npm install
(edit index.js. Set InfluxDB settings at top, and XenServer IP and login details near line 20)
node index (to start in debug mode)
```

# Daemonize with Forver-service
```
npm install -g forever
npm install -g forever-service
forever-service install xennode --script index.js
```
You can then use your operating systems choice of service management to autostart this script or manually start. For CentOS 7
```
systemctl enable xennode
systemctl start xennode
```
