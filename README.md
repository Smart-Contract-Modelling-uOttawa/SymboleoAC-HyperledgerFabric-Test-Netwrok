
 
## Installation

## install docker, docker-compose

```bash
## 

$ sudo apt update

$ sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg


$ echo "deb [signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io

$ docker --version

$ sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ docker-compose --version


$ sudo usermod -aG docker $USER

$ NOTE: after completing all the steps restart your system

```

## Running the network-sofana 

```bash

$ export PATH=${PWD}/bin:$PATH
$ export FABRIC_CFG_PATH=${PWD}/configtx
$ export VERBOSE=false

## bring up the network-sofana with fabric-ca

$ docker stop $(docker ps -aq)
$ docker rm $(docker ps -aq)
$ docker container prune
$ docker volume ls
$ docker image prune
$ docker network prune
## if wants to perform all above 4 operation in one command
$ docker system prune

## remove any previous container and artifcats
$ ./network.sh down

$ ./network.sh up -ca -cai 1.4.4 -i 2.2.2
$ ./network.sh up -cai 1.4.4 -i 2.2.2
$ ./network.sh up -cai 1.4.4 -i 2.2.4
# I used the command below with the following version to run the network
$ ./network.sh up -ca -cai 1.4.4 -i 2.2.4

```

## create channel and join it to org1
```bash
$ ./network.sh createChannel -c mychannel

```

## install and deployment of chaincode
```bash
$ ./network.sh createChannel -c mychannel

$ ./network.sh deployCC -c mychannel -ccn <chaincode name > -ccv <chaincode_version > -ccs <seq no > -ccp <chaincode dir path > -ccl < lang > 

$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.0 -ccs 1 -ccp MeatSale -ccl javascript 
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.1 -ccs 2 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.2 -ccs 3 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.3 -ccs 4 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.4 -ccs 5 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.5 -ccs 6 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.6 -ccs 7 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.7 -ccs 8 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.8 -ccs 9 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.9 -ccs 10 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.0 -ccs 1 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.1 -ccs 2 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.2 -ccs 11 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.3 -ccs 12 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.4 -ccs 13 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.5 -ccs 14 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.6 -ccs 15 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.7 -ccs 16 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.8 -ccs 17 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 2.9 -ccs 18 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.0 -ccs 19 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.1 -ccs 20 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.2 -ccs 21 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.3 -ccs 22 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.4 -ccs 23 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.5 -ccs 24 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.6 -ccs 25 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.7 -ccs 26 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.8 -ccs 27 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 3.9 -ccs 28 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.0 -ccs 29 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.1 -ccs 30 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.2 -ccs 31 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.3 -ccs 32 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.4 -ccs 33 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.5 -ccs 34 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.6 -ccs 35 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.7 -ccs 36 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.8 -ccs 37 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 4.9 -ccs 38 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.0 -ccs 39 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.1 -ccs 40 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.2 -ccs 41 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.3 -ccs 42 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.4 -ccs 43 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.5 -ccs 44 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.6 -ccs 45 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.7 -ccs 46 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.8 -ccs 47 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 5.9 -ccs 48 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.0 -ccs 49 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.1 -ccs 50 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.2 -ccs 51 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.3 -ccs 52 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.4 -ccs 53 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.5 -ccs 54 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.6 -ccs 55 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.7 -ccs 56 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.8 -ccs 57 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 6.9 -ccs 58 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.0 -ccs 59 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.1 -ccs 60 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.2 -ccs 61 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.3 -ccs 62 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.4 -ccs 63 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.5 -ccs 64 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.6 -ccs 65 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.7 -ccs 66 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.8 -ccs 67 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 7.9 -ccs 68 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 8.0 -ccs 69 -ccp MeatSale -ccl javascript
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 8.1 -ccs 70 -ccp MeatSale -ccl javascript





































```

## Test

```bash
# get transaction by transactionId

$ docker exec -it peer0.org1.example.com sh
$ peer chaincode query -o localhost:7050 -C mychannel -n qscc  -c '{"function":"GetTransactionByID","Args":["mychannel", "2854533c3c95881a4a791b4c749eef7f9e25d8748088ed9e6e710be6ef7ca21d"]}'
#peer chaincode query -o localhost:7050 -C mychannel -n qscc  -c '{"function":"GetTransactionByID","Args":["mychannel", "f40134b8e0cabe929d5beab02eb5c13af45ebbfb70a377fc376edd228ae1a26b"]}'
#peer chaincode query -o localhost:7050 -C mychannel -n qscc  -c '{"function":"GetTransactionByID","Args":["mychannel", "1270e47ea5a2f2d2bd6af2408aeb8d4f4232c585d2335dd80e5ea0fec3c61826"]}'

# check orderer, peer logs 
$ docker logs orderer.example.com -f
$ docker logs peer0.org1.example.com -f

# chaincode logs
$ docker ps 

# then copy chaincode container ID

$ docker logs 0e52d6cc7f34 -f

