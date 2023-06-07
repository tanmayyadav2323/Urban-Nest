const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate, escrow;

    beforeEach(async()=>{
        [buyer, seller, inspector, lender] = await ethers.getSigners();


        //Deploy the contract
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();
        console.log(realEstate);

        //Mint the nft
        let transaction = await realEstate.connect(seller).mint('https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png');
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        );
    })

    describe('Deployment',()=>{
        it('Returns NFT address',async()=>{
            const result = await escrow.nftAddress();
            expect(result).to.be.equal(realEstate.address);
        })
    
        it("Returns seller", async() =>{
           const result = await escrow.seller();
            expect(result).to.be.equal(realEstate.seller);
        })
    
        it("Returns inspector", async() =>{
            const result = await escrow.inspector();
            expect(result).to.be.equal(realEstate.inspector);
        })
    
        it("Returns lender",async()=>{
            const result = await escrow.lender();
            expect(result).to.be.equal(realEstate.lender);
        })    
    });


})
