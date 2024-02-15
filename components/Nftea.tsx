'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'

const Label = () => {
    return(
        <>
        <section className="relative table w-full py-36 bg-[url('/assets/images/bg/bg1.jpeg')] bg-bottom bg-no-repeat">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
            <div className="container">
                <div className="grid grid-cols-1 pb-8 text-center mt-10">
                    <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">NfTea</h3>
                
                </div>
            </div>

            <div className="absolute text-center z-10 bottom-5 right-0 left-0 mx-3">
                <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                   <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><a href="index.html">NfTea</a></li>
                    <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page">NFTea's</li>
                </ul>
            </div>
        </section>

        <div className="relative">
            <div className="shape absolute right-0 sm:-bottom-px -bottom-[2px] left-0 overflow-hidden z-1 text-white dark:text-slate-900">
                <svg className="w-full h-auto" viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>

        <section className="relative md:py-24 py-16">
            <div className="container">

                    <div className="lg:col-span-12">
                        <div className="lg:ml-5">
                            <div className="container mx-auto py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-4">Discover the Power of Smart NFTs</h2>
                                    <p className="text-gray-700">
                                        Smart NFTs are not just ordinary digital collectibles. They are limited edition NFTs attached to a smart contract,
                                        revolutionizing the world of digital assets. With a real value and dynamic functionality, Smart NFTs offer unparalleled
                                        opportunities for creators, collectors, and gamers alike.
                                    </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-4">Unlock Financial Possibilities</h2>
                                    <p className="text-gray-700">
                                        NFTEA introduces the concept of crypto collaterals through Smart NFTs. Now, you can use your NFT and the assets stored in
                                        its smart contract vault as collateral for loans. No need for a traditional banking system - NFTEA empowers individuals
                                        in all corners of the world to leverage their digital assets for financial opportunities.
                                    </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-4">Immerse Yourself in the Ultimate Gaming Experience</h2>
                                    <p className="text-gray-700">
                                        NFTEA takes gaming to the next level with Smart NFTs. Imagine a world where game characters' attributes are represented
                                        as tokens in their wallets. Speed, power, defense - all customizable and tradable assets. Battle it out in epic Pokémon-style
                                        arenas, where each move is powered by the unique combination of tokens within your Smart NFT's wallet.
                                    </p>
                                    </div>
                                </div>

                                <div className="mt-8 whiteText">
                                    <h2 className="text-3xl font-bold mb-4">Time Locked Value: Unleash the Potential of Smart NFTs</h2>
                                    <p className="text-lg text-gray-700 whiteText">Imagine a world where Smart NFTs go beyond their inherent value and provide a new level of motivation and reward. With Time Locked Value, these revolutionary digital assets allow you to lock valuable tokens within the NFT's smart contract for a specific period. Let's explore the possibilities with an inspiring example.</p>
                                    <div className="mt-8">
                                    <h3 className="text-2xl font-semibold">Time Locked Value for Education</h3>
                                    <p className="text-lg text-gray-700 whiteText">Meet Alex, a bright 5th grader who owns a Smart NFT linked to their academic journey. This extraordinary NFT holds a treasure trove of token assets, representing their accomplishments and milestones throughout their educational voyage. However, there's a unique twist: these assets are time-locked, only accessible upon graduating high school.</p>
                                    <p className="text-lg text-gray-700 whiteText">This concept transforms the way we approach education and motivation. As Alex progresses through each grade, their Smart NFT becomes a tangible symbol of their academic achievements, waiting patiently for the grand unlocking ceremony at high school graduation. The locked assets within the NFT serve as a powerful incentive, igniting a whole new level of determination and drive within Alex.</p>
                                    <p className="text-lg text-gray-700 whiteText">Picture the excitement and sense of accomplishment as Alex unlocks their Smart NFT, revealing the well-deserved rewards for years of hard work and dedication. It's a transformative experience, reinforcing the value of education and providing a lasting reminder of their academic journey.</p>
                                    </div>
                                    <div className="mt-8">
                                    <h3 className="text-2xl font-semibold">Unlocking Potential in Various Domains</h3>
                                    <p className="text-lg text-gray-700 whiteText">Time Locked Value within Smart NFTs doesn't just incentivize students; it opens up a world of possibilities for various domains. From sports to creative arts, professional development to personal growth, these locked assets can represent future opportunities waiting to be unlocked.</p>
                                    <p className="text-lg text-gray-700 whiteText">At the heart of it all, Time Locked Value in Smart NFTs redefines motivation, fostering a deeper connection between individuals and their goals. It's a powerful tool that inspires excellence, encourages perseverance, and amplifies the joy of accomplishment.</p>
                                    </div>
                                    <div className="mt-8">
                                    <h3 className="text-2xl font-semibold">Experience the Transformative Power</h3>
                                    <p className="text-lg text-gray-700 whiteText">Join us on this groundbreaking journey where Smart NFTs transcend their traditional boundaries and empower individuals to unlock their full potential. Experience the transformative power of Time Locked Value – because the greatest achievements are worth the wait.</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-3xl font-bold mb-4 whiteText">Embrace the Future of NFTs</h2>
                                    <p className="text-gray-700 whiteText">
                                    NFTEA is leading the way in the evolution of NFTs, as validated by the ERC 6551 proposal. Experience the limitless possibilities
                                    of Smart NFTs, whether you're an artist, collector, gamer, or simply someone who wants to be at the forefront of the digital
                                    revolution. Unlock new dimensions with NFTEA today!
                                    </p>
                                </div>
                            </div>


                    </div>
                </div>
            </div>

 </section>
        </>
    )
}
export default Label;
