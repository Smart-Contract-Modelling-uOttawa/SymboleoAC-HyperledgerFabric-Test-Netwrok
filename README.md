# SymboleoAC HyperledgerFabric Test Network

**SymboleoAC HyperledgerFabric Test Network** is a Hyperledger Fabric-based test network used to deploy and run smart contracts generated from SymboleoAC specifications. It provides a controlled environment to test, execute, and validate contract behavior on a blockchain platform.

## Platform notes (Linux / WSL)

Two setup issues bite non-macOS hosts:

- **Binaries (Test-Netwrok#1).** The repo ships both `bin/` (Linux) and
  `bin-macos/` (macOS). `network.sh` now selects the right directory by OS
  (`uname -s`), so Linux/WSL no longer picks the Mach-O binaries and fails with
  *"Peer binary and configuration files not found.."*. (Previously the path was
  hard-wired to `bin-macos`.)
- **Node runtime (Test-Netwrok#2).** Fabric 2.2's node chaincode runtime
  image, `hyperledger/fabric-nodeenv:2.2`, is Node 12, which cannot parse modern
  JavaScript (e.g. `||=`) emitted by current chaincode dependencies; the
  chaincode container then exits with `SyntaxError: Unexpected token '='` during
  registration. Before deploying a `javascript`/`typescript` chaincode, run once
  per host:

  ```bash
  scripts/fix-nodeenv.sh
  ```

  which retags a modern nodeenv (`:2.5`, Node 22) under the `:2.2` tag the peer
  looks for (idempotent; a no-op if `:2.2` already runs Node 18+). `deployCC`
  prints a reminder when it deploys a node chaincode.

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

## Running the network

```bash

$ export PATH=${PWD}/bin:$PATH
$ export FABRIC_CFG_PATH=${PWD}/configtx
$ export VERBOSE=false

## bring up the network with fabric-ca

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

### General Deployment Command

$ ./network.sh deployCC -c mychannel -ccn <chaincode name > -ccv <chaincode_version > -ccs <seq no > -ccp <chaincode dir path > -ccl < lang > 

### Example Deployments

# Meat Sale
$ ./network.sh deployCC -c mychannel -ccn meatsale -ccv 1.0 -ccs 1 -ccp MeatSale -ccl javascript 

# Vaccine Procurement
$ ./network.sh deployCC -c mychannel -ccn vaccineprocurementc -ccv 1.0 -ccs 1 -ccp VaccineProcurementC -ccl javascript

# Vaccine Procurement (Shared Party)
$ ./network.sh deployCC -c mychannel -ccn vaccineprocurementsharedparty -ccv 1.0 -ccs 1 -ccp VaccineProcurementSharedParty -ccl javascript

# Meat Sale (Shared Party)
$ ./network.sh deployCC -c mychannel -ccn meatsalesharedparty -ccv 1.0 -ccs 1 -ccp MeatSaleSharedParty -ccl javascript

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

