To run first install dependencies by running npm install.

Create a .env file in the root directory with your wallet keys in the format

OWNER_PRIVATE_LIVE = ""
OWNER_ADDRESS_LIVE = ""
INFURA_TOKEN = ""

containing your address private key, address and infura token reespectively

To run on local blockchain use npm run start:dev

To run on live blockchain use npm run start:prod

To get the contract address, a reciept is generated in the console when  the application starts. Simply copy the address.

To distribute, make a get request to this end point http://localhost:8080/distribute

