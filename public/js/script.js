const web3 = new Web3(Web3.givenProvider);

// Polygon Mainnet Params
const POLYGON_MAINNET_PARAMS = {
  chainId: '0x89', // 137
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon.llamarpc.com'],
  blockExplorerUrls: ['https://polygonscan.com/']
}


if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}

let accounts = [];

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log("Now connected to address: " + accounts[0])
}

getAccount()

async function onSubmit(e) {
    console.log("Submit was pressed")

    e.preventDefault();

    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] })

    showSpinner();

  // Create transaction object
  const txObject = {
    from: accounts[0],
    to: '0x1485F6c36759B9C6EFA44773C08CF6b0005139ba',
    value: web3.utils.toWei('1', 'ether'),
    gas: 24000,
    gasPrice: web3.utils.toWei('500', 'gwei')
  };

  // Sign and send the transaction
  await web3.eth.sendTransaction(txObject, function(error, txHash) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Transaction hash: ${txHash}`);
      console.log("Metamask should close")
    }
  });
  
    document.querySelector('.msg').textContent = '';
    document.querySelector('#image').src = '';

    if (prompt === '') {
      alert('Please add some text');
      return;
    }
  
    var prompt = document.querySelector('#prompt').value;
    const size = 1024
    // const size = document.querySelector('#size').value;
    const style = document.querySelector('#style').value;
    const color = document.querySelector('#color').value;
  
    prompt = "A Shiba Inu " + prompt + ", " + style + ", " + color
    console.log("Will send a request to generate: " + prompt)
    generateImageRequest(prompt, size);
  }
  
  async function generateImageRequest(prompt, size) {
    try {
      // showSpinner();
  
      const response = await fetch('http://localhost:5001/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size,
        }),
      });
  
      if (!response.ok) {
        removeSpinner();
        throw new Error('That image could not be generated');
      }
  
      const data = await response.json();
      // console.log(data);
  
      const imageUrl = data.data;
  
      document.querySelector('#image').src = imageUrl;
  
      removeSpinner();
    } catch (error) {
      document.querySelector('.msg').textContent = error;
    }
  }
  
  function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
  }
  
  function removeSpinner() {
    document.querySelector('.spinner').classList.remove('show');
  }
  
  document.querySelector('#image-form').addEventListener('submit', onSubmit);
