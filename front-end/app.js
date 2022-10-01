const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "addToBlockchain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllTransactions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct BillBoard.BillStruct[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x835f3fD2B011b628C6cA208959Ba9e38c6d14A89";

const billEl = (sender, message, time) =>
  `<div class="bill">
  <p class="bill__sender">
      By: ${sender}
    </p>
  <p class="bill__msg">
  ${message} 
  </p>
  <p class="bill__time">
     At: ${time}
  </p>
</div>`;

// Connect wallet function
async function connectWallet() {
  try {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    account = accounts[0];

    return true;
  } catch (error) {
    alert("Something went wrong!!! Pls try again");
  }
}

const getBillBoards = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, ABI, signer);

      // 1 get bills
      let bills = await contract.getAllTransactions();

      bills.forEach((el) => {
        var theDate = new Date(el.timestamp.toNumber() * 1000);
        dateString = theDate.toGMTString();

        console.log(dateString);
        console.log(el.sender);
        console.log(el.message);

        document
          .getElementById("billboard")
          .insertAdjacentHTML(
            "afterbegin",
            billEl(el.sender, el.message, dateString)
          );
      });

      return bills;
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const addMyMessage = async ( msg ) => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, ABI, signer);

      let msgTx = await contract.addToBlockchain( msg );
      
      alert("Your Message is adding... Pls Wait!");

      let tx = await msgTx.wait();

      if (tx) {
        window.location = "/";
      }
    } else {
      alert("Ethereum object doesn't exist!");
    }
  } catch (error) {
    alert("Error Adding Message!!");
  }
};

document.getElementById("add-btn").addEventListener('click' , (e)=>{
  e.preventDefault();

  const msg =  document.getElementById("msg-input").value;
  addMyMessage(msg);
})


window.onload = async () => {
  await connectWallet();
  await getBillBoards();
};

