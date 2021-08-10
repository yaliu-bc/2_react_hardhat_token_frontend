import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';
import Token from './artifacts/contracts/Token.sol/Token.json';

//on localhost: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  const [userAccountFrom, setUserAccountFrom] = useState('');
  const [userAccountTo, setUserAccountTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [balanceFrom, setBalanceFrom] = useState('');
  const [balanceTo, setBalanceTo] = useState('');

  async function requestAccount(){
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function getTokenInfo(){
    if(typeof window.ethereum !== 'undefined' ) {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);

      try{
        const name = await contract.getName();
        console.log('Token name: ', name);
        setTokenName(name);

        const symbol = await contract.getSymbol();
        console.log('Symbol: ', symbol);
        setTokenSymbol(symbol);

        const supply = await contract.getSupply();
        console.log('Total supply: ', supply);
        setTokenSupply(supply.toString());
      }catch(err){
        console.log('Error: ', err);
      }
    }
  }

  async function transfer(){
    if(typeof window.ethereum !== 'undefined') {
      //connect the account
      await requestAccount();

      //call the contract to proceed a transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccountFrom,userAccountTo,amount);
      
      //wait for the transaction to finish
      await transaction.wait();

      //refresh UI
      getBalance();
    }
  }

  async function getBalance(){
    if(typeof window.ethereum !== 'undefined' ) {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);

      try{
        const balance_f = await contract.balanceOf(userAccountFrom);
        console.log('From Account Balance: ', balance_f);
        setBalanceFrom(balance_f.toString());

        const balance_t = await contract.balanceOf(userAccountTo);
        console.log('To Account Balance: ', balance_t);
        setBalanceTo(balance_t.toString());
      }catch(err){
        console.log('Error: ', err);
      }
    }
  }

  async function swapAccount(){
    const account_tem = userAccountTo;
    setUserAccountTo(userAccountFrom);
    setUserAccountFrom(account_tem);

    const balance_tem = balanceTo;
    setBalanceTo(balanceFrom);
    setBalanceFrom(balance_tem);
  }

  return (
    <div className="App">
      <header className="App-header">
      <button onClick={getTokenInfo}>Click to Show Current Token Info</button>
      <p>{tokenName}, {tokenSymbol}, Total Supply: {tokenSupply}</p> 
      <label>
        Account From: 
        <input
          onChange={e=>setUserAccountFrom(e.target.value)}
          placeholder='Transfer From'
          value={userAccountFrom}
          />
          </label>
          <label>
        Account To: 
        <input
          onChange={e=>setUserAccountTo(e.target.value)}
          placeholder='Transfer To'
          value={userAccountTo}
          />
          </label>
          <label>
        Amount: 
        <input
          onChange={e=>setAmount(e.target.value)}
          placeholder='Amount to Transfer'
          value={amount}
          />
          <button onClick={swapAccount}>Swap Accounts</button>
          </label>
          <button onClick={transfer}>Transfer</button>
          <p/>
          <button onClick={getBalance}>Check Balance</button>
          <label>{userAccountFrom} {balanceFrom}</label>
          <label>{userAccountTo} {balanceTo}</label>
      </header>
    </div>
  );
}

export default App;

