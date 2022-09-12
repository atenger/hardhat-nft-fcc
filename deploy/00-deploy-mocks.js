const { developmentChains, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")
const { getNamedAccounts, deployments, network, ethers } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 ist the premium, it costs .25 link per request
const GAS_PRICE_LINK = 1e9

//calculated value based on the gas price of the chain

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks")

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK], // base fee & gas price ink
        })

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("Mocks deployed!")
        log("----------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
