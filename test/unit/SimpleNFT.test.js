// We are going to skimp a bit on these tests...

const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Simple NFT Unit Tests", function () {
          let SimpleNFT, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()

              deployer = accounts[0]

              await deployments.fixture(["SimpleNFT"])

              SimpleNFT = await ethers.getContract("SimpleNFT")
          })

          describe("Constructor", () => {
              it("Initilizes the NFT Correctly.", async () => {
                  const name = await SimpleNFT.name()
                  const symbol = await SimpleNFT.symbol()
                  const tokenCounter = await SimpleNFT.getTokenCounter()
                  assert.equal(name, "Doggie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const txResponse = await SimpleNFT.mintNFT()
                  await txResponse.wait(1)
                  const tokenURI = await SimpleNFT.tokenURI(0)
                  const tokenCounter = await SimpleNFT.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await SimpleNFT.TOKEN_URI())
              })
          })
      })
