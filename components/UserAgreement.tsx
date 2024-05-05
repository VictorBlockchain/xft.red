import Link from "next/link";

const UserAgreement = () => {
    
    return(
        <>
                <div className="cs-height_90 cs-height_lg_80"></div>
        
                <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
            <div className="container">
            <div className="text-center">
            <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Terms</h1>
            <ol className="breadcrumb">
            <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><Link href="/agreement">Terms</Link></li>
            </ol>
            </div>
            </div>
        </section>
        <div className="cs-height_30 cs-height_lg_30"></div>
        <div className="container">
        <section className="relative md:py-24 py-16">
                <div className="md:flex justify-center">
                    <div className="md:w-3/4">
                        <div className="p-6">
                            <div className="text-gray-800">
                                <h1 className="text-3xl font-bold mb-4">User Agreement</h1>

                                <p className="mb-4">Welcome to XFT.red. This User Agreement (&quot;Agreement&quot;) governs your use of our Smart NFT Marketplace platform (&quot;Platform&quot;). By accessing or using our Platform, you agree to comply with this Agreement. Please read it carefully.</p>

                                <h2 className="text-2xl font-bold mb-4">1. Use of the Platform</h2>

                                <p className="mb-4">1.1. Eligibility: You must be of legal age and have the legal capacity to enter into this Agreement in your jurisdiction.</p>

                                <p className="mb-4">1.2. User Wallet Security: You are responsible for maintaining the security and confidentiality of your user wallet associated with the Platform. You must not share your wallet credentials with anyone and take appropriate measures to prevent unauthorized access.</p>

                                <p className="mb-4">1.3. Prohibited Content: You agree not to upload, publish, or transmit any inappropriate, illegal, or infringing content on the Platform. This includes, but is not limited to, content that violates intellectual property rights, promotes violence or hate speech, contains explicit or adult material, or violates any applicable laws or regulations.</p>

                                <h2 className="text-2xl font-bold mb-4">2. Smart NFTs and Smart Contracts</h2>

                                <p className="mb-4">2.1. Smart NFTs: Our Platform facilitates the trading of Smart NFTs, which are NFTs attached to a smart contract. Smart NFTs may contain token assets, including other NFTs, as defined by the associated smart contract.</p>

                                <p className="mb-4">2.2. Ownership and Rights: Ownership and rights to the Smart NFTs are governed by the terms and conditions of the respective smart contracts. By engaging in transactions involving Smart NFTs on our Platform, you agree to abide by the terms and conditions set forth in the smart contracts.</p>

                                <h2 className="text-2xl font-bold mb-4">3. Intellectual Property Rights</h2>

                                <p className="mb-4">3.1. Our Platform: The Platform, including its design, features, and content, is protected by intellectual property rights owned by us or our licensors. You agree not to copy, modify, distribute, or create derivative works based on our Platform without our prior written consent.</p>
                                
                                <p className="mb-4">3.2. User Content: You retain ownership of the content you upload to the Platform. However, by uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, distribute, and display your content for the purposes of operating and promoting the Platform.</p>

                                <h2 className="text-2xl font-bold mb-4">4. Disclaimer and Limitation of Liability</h2>

                                <p className="mb-4">4.1. Platform "As Is": The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not make any warranties or representations regarding the accuracy, reliability, or completeness of the Platform or its content.</p>

                                <p className="mb-4">4.2. No Financial Advice: The Platform does not provide financial advice. Any information or content on the Platform is for informational purposes only and should not be considered as financial, investment, or legal advice.</p>

                                <p className="mb-4">4.3. Limitation of Liability: To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of or in connection with your use of the Platform.</p>
                                
                                <h2 className="text-2xl font-bold mb-4">5. Termination</h2>
                                
                                <p className="mb-4">5.1. Termination: We reserve the right to terminate or suspend your access to the Platform, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of this Agreement.</p>

                                <h2 className="text-2xl font-bold mb-4">6. Governing Law and Dispute Resolution</h2>
                                
                                <p className="mb-4">6.1. Governing Law: This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of laws principles.</p>
                                
                                <p className="mb-4">6.2. Dispute Resolution: Any disputes arising out of or relating to this Agreement shall be resolved through binding arbitration or the courts of [Your Jurisdiction], as determined by [Your Company Name] at its sole discretion.</p>

                                <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>

                                <p className="mb-4">7.1. Amendments: We reserve the right to modify or replace this Agreement at any time. Any changes will be effective immediately upon posting the revised Agreement on the Platform. Your continued use of the Platform after the posting of any changes constitutes your acceptance of the modified Agreement.</p>

                                <p className="mb-4">7.2. Notification: We may notify you of any material changes to this Agreement through email or by prominently displaying a notice on the Platform.</p>
                                
                                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>

                                <p className="mb-4">If you have any questions, concerns, or requests regarding this User Agreement or our services, please contact us at:</p>

                                <p>XFT.red</p>
                                <p>cs@xft.red</p>
                                </div>
                                                                        </div>
                </div>
            </div>
        </section>
        </div>
        
        </>
    )

}
export default UserAgreement;