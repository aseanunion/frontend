let provider, signer, userAddress;
const citizenNFTAddress = "0x74DE86eD5b0948D07fCd7E6B03864D992082C21F";

// Auto-connect on page load if previously connected
window.addEventListener("load", async () => {
  if (window.ethereum && window.localStorage.getItem("wallet")) {
    try {
      await connectWallet();
    } catch (err) {
      console.warn("🟡 Auto-connect failed:", err);
    }
  }
});

// Listen for wallet/account change
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    window.localStorage.removeItem("wallet");
    location.reload(); // Clean reset
  });
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("🦊 MetaMask is required.");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();

  const display = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

  // Update connect button text and disable
  const connectBtn = document.getElementById("connectBtn");
  if (connectBtn) {
    connectBtn.innerText = display;
    connectBtn.disabled = true;
    connectBtn.classList.remove("btn-outline-light");
    connectBtn.classList.add("btn-success");
  }

  // Also update fallback span
  const walletSpan = document.getElementById("walletAddress");
  if (walletSpan) walletSpan.innerText = display;

  // Store wallet in localStorage
  window.localStorage.setItem("wallet", userAddress);
  window.walletConnected = true;

  await checkCitizen();
}

async function checkCitizen() {
  const abi = [
    "function balanceOf(address owner) view returns (uint256)"
  ];
  const contract = new ethers.Contract(citizenNFTAddress, abi, provider);
  const balance = await contract.balanceOf(userAddress);
  window.isCitizen = balance > 0;
}
