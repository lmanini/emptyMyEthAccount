const {ethers, BigNumber} = require("ethers")
const MY_PRIV_KEY = ""  //change me
const TO = "";          //change me
const GAS_PRICE = 420;  //change me

const provider = new ethers.providers.InfuraProvider("homestead","")
const signer = new ethers.Wallet(MY_PRIV_KEY)

const GWEI = ethers.utils.parseUnits("1", "gwei")
const ETH = ethers.utils.parseUnits("1", "ether")

async function emptyMyWallet(targetAddress, gasPriceInGwei) {

    console.log("Starting process to empty wallet", signer.address, "\nForwarding balance to", targetAddress)

    let myNonce = await provider.getTransactionCount(signer.address)
    let gasPriceInWei = ethers.BigNumber.from(gasPriceInGwei).mul(GWEI)
    let gasLimit = 21000 //default gas cost for eth transfer with empty data field

    let totalBalance = await provider.getBalance(signer.address)
    let sendableValue = totalBalance.sub(gasPriceInWei.mul(ethers.BigNumber.from(gasLimit)))

    let transactionReq = {
        from: signer.address,
        to: targetAddress,
        nonce: myNonce,
        data: "0x",
        gasLimit: ethers.BigNumber.from(gasLimit),
        gasPrice: gasPriceInWei,
        value: sendableValue,
        type: 0,
        chainId: 1
    }

    let signedTx = await signer.signTransaction(transactionReq)
    let txResponse = await provider.sendTransaction(signedTx)

    console.log("Wallet has been drained.", ethers.utils.formatEther(sendableValue), "ETH has been sent to", targetAddress)
    console.log("Transaction hash: ", txResponse.hash)
}

emptyMyWallet(TO, GAS_PRICE)
    .then(() => process.exit(0))
