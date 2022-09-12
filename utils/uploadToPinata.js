const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

//This is using the API KEY & Secret so we can use pinata
const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    console.log("Uploading to IPFS")
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log(`Files: ${files}`)

    let responses = []

    for (fileIndex in files) {
        console.log(`Working on File: ${fileIndex}`)
        console.log(`${fullImagesPath}/${files[fileIndex]}`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            //console.log(`API Key: ${pinataApiKey} and Secret: ${pinataApiSecret}`)
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    console.log(`Getting ready to store Meta data for: ${metadata}`)
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(`Yikes! Error occurred storing metadata.  Deets: ${error}`)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
