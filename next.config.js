/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {
  env: {
    teaToken: process.env.teaToken,
    teaPot:process.env.teaPot,
    mintLogic:process.env.mintLogic,
    shopStorage:process.env.shopStorage,
    shopLogic:process.env.shopLogic,
    teaToken:process.env.teaToken,
    bagStorage:process.env.bagStorage,
    bagLogic:process.env.bagLogic,
    operatorStorage:process.env.operatorStorage,
    operatorLogic:process.env.operatorLogic,
    mintStorage:process.env.mintStorage,
    mint:process.env.mint,
    kettle:process.env.kettle,
    fire:process.env.fire
  
  },
  pageExtensions: ['tsx'],
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer }) => {
    // This allows the app to refer to files through our symlink
    if (!isServer) {
        config.resolve.fallback.fs = false;
    }
    config.resolve.symlinks = false
    return config
},images: {
    domains: ['cdn.example.com', 'avatars.githubusercontent.com','ipfs.io','nftea.infura-ipfs.io','github.com','bafybeihplhfmazxtn7kenp7pcf6rxjligjlhpmiynealcy5k4ilkzrjaji.ipfs.nftstorage.link','cdn-2.galxe.com'],
  },
}


module.exports = nextConfig
