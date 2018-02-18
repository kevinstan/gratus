class Creator {

    constructor(name, bio, img) {
        this.name = name;
        this.bio = bio;
        this.img = img;
    }
}

// <script src="https://unpkg.com/ipfs-api/dist/index.js"></script>
var ipfs = window.IpfsApi('localhost', '5001');
var mainABI = "temp"
var contract = web3.eth.contract(mainABI).at(contractAddress);

document.getElementByID('myForm').addEventListener('submit', submitYourContract);

function submitYourContract(){
    var contractAddress = document.getElementByID('contract-address').value;
    var ipfsHashSrc = document.getElementByID('ipfs-hash-src').value;
    var ipfsHashAbi = document.getElementByID('ipfs-hash-abi').value;

    contract.submitContract(contractAddress, ipfsHashSrc);
}

function getNCreatorInfo(n){
    
    var randomAddresses = [];
    randomAddresses = contract.getRandomContractAddress(n);
    var addressesLength = randomAddresses.length;
    var creators : Creator[] = new Creator[addressesLength];
    var contractABI;

    for (var i=0; i<addressesLength; i++){

        ipfs.files.cat(contract.getAbiHashFromContract(randomAddresses[i]), function (err, file) {
           if (err) {
             throw err
            }
         contractABI = file.toString(‘utf8’);
        })

        contractABI = JSON.parse(contractABI);

        var contractI = web3.eth.contract(contractABI).at(randomAddresses[i]);
        creators[i] = new Creator(contractI.getCreatorName(), contractI.getCreatorBio(), contractI.getCreatorDisplayImage());
    }

    return creators;
}


// function getNCreatorInfo(n, field) {
//     if (field == name || field == bio) {
//         var fields = [];
//         var randomAddresses = [];
//         randomAddresses = contract.getRandomContractAddress(n);
//         var addressesLength = randomAddresses.length;

//         for (var i=0; i<addressesLength; i++){
//             var x = contract.getCreatorInfoFromAddress(randomAddresses[i], field);
//             x = web3.toAscii(x);
//             fields.push(x);
//         }
//     }
//     else if (field == img) {
//         for (var i=0; i<addressesLength; i++){
//             var x = contract.getCreatorInfoFromAddress(randomAddresses[i], field);
//             x = web3.toAscii(x);
//             x = "ipfs.io/ipfs/"+x
//             fields.push(x);
//         }
//     }

//     return fields;
// }

function displayNDynamicBoxes(n){
    var creators : Creator[] = getNCreatorInfo(n);
    var nLength = creators.length;

    for (var i = 0; i < nLength; i++){
        var html = '<div class="col-lg-4"><div class="card"><img class="card-img-top" src=' + creators[i].img + '>' + 
            '<div class="card-block"><h4 class="card-title">' + creators[i].name + '</h4><p class="card-text">' +
        creators[i].bio + '</p><a href="profile.html" class="btn btn-primary">Donate</a></div><br></div></div>'
        var profile = $("#profile").append(html);
    }
}



