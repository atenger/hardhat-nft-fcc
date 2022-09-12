const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-----------------------------------------")
    log("BEGIN SIMPLE NFT DEPLOY")

    const args = []
    const SimpleNFT = await deploy("SimpleNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`FINISH DEPLOYING ON NETWORK: ${network.name} `)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("BEGIN VERIFY")

        await verify(SimpleNFT.address, args)

        log("END VERIFY")
    }

    log("END SIMPLE NFT SCRIPT")
    log("-----------------------------------------")
}

module.exports.tags = ["all", "basicnft", "main", "SimpleNFT"]
