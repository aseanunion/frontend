let provider, signer, userAddress;
const citizenNFTAddress = "0x74DE86eD5b0948D07fCd7E6B03864D992082C21F"; // replace with actual

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    window.localStorage.setItem("wallet", userAddress);
    await checkCitizen();
  } else {
    alert("MetaMask required.");
  }
}

async function checkCitizen() {
  const abi = [
    "function balanceOf(address owner) view returns (uint256)"
  ];
  const contract = new ethers.Contract(citizenNFTAddress, abi, provider);
  const balance = await contract.balanceOf(userAddress);
  window.isCitizen = balance > 0;
}
