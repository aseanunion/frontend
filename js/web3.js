let provider, signer, userAddress;

// Replace with your actual ASEANX token address
const aseanxTokenAddress = "0xaa82A5E45a8B7d32527e17e6274B17a3428c628F";

// Minimal ERC20 ABI to get balance
const erc20ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Auto-connect if previously connected
window.addEventListener("load", async () => {
  if (window.ethereum && localStorage.getItem("wallet")) {
    try {
      await connectWallet();
    } catch (err) {
      console.warn("🟡 Auto-connect failed:", err);
    }
  }
});

// Listen for account change
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    localStorage.removeItem("wallet");
    location.reload();
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

  const connectBtn = document.getElementById("connectBtn");
  if (connectBtn) {
    connectBtn.innerText = display;
    connectBtn.disabled = true;
    connectBtn.classList.remove("btn-outline-light");
    connectBtn.classList.add("btn-success");
  }

  const walletSpan = document.getElementById("walletAddress");
  if (walletSpan) walletSpan.innerText = display;

  localStorage.setItem("wallet", userAddress);
  window.walletConnected = true;

  await loadASEANXBalance();
}

async function loadASEANXBalance() {
  const tokenContract = new ethers.Contract(aseanxTokenAddress, erc20ABI, provider);
  const balanceRaw = await tokenContract.balanceOf(userAddress);
  const decimals = await tokenContract.decimals();
  const symbol = await tokenContract.symbol();

  const balance = ethers.formatUnits(balanceRaw, decimals);
  const balanceEl = document.getElementById("tokenBalance");
  if (balanceEl) {
    balanceEl.innerText = `${balance} ${symbol}`;
  } else {
    console.log(`💰 ASEANX Balance: ${balance} ${symbol}`);
  }
}
