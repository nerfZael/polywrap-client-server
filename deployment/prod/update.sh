#!/bin/sh
staging=~/staging
hosting=~/hosting

clientServer=polywrap/client-server

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

npm config set prefix '~/.npm-global'
echo "export PATH=~/.npm-global/bin:\$PATH" >> ~/.profile
source ~/.profile

pm2 delete polywrap-client-server

set -e

mkdir -p $hosting/$clientServer
cd $hosting/$clientServer
cp -r $staging/$clientServer/bin ./
cp -r $staging/$clientServer/node_modules ./

pm2 start $hosting/$clientServer/bin/main.js --name polywrap-client-server

pm2 save