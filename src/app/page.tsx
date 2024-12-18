
"use client";

import React, { useState , useEffect } from "react";
import { useWallet, type Wallet } from "@txnlab/use-wallet-react";
import { Modal } from "@/components/WalletModal";
import { Button } from "@/components/ui/button"
import algosdk from "algosdk";


export default function Home() {

  const {
    algodClient,
    activeAddress,
    activeNetwork,
    setActiveNetwork,
    transactionSigner,
    wallets,
  } = useWallet();

  // const [isSending, setIsSending] = React.useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [transactionInProgress, setTransactionInProgress] =
  useState<boolean>(false);
const [isSending, setIsSending] = useState(false);
const [transactionLink, setTransactionLink] = useState('');

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleDisconnect = () => {
    const activeWallet = wallets.find(wallet => wallet.isConnected)
    if (activeWallet) {
      activeWallet.disconnect()
      
    }
  }

  const sign_verify = async () => {
    try {
      if (!activeAddress) {
        throw new Error("[App] No active account");
      }

      
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      //   from: activeAddress,
      //   to: activeAddress,
      //   amount: 0, // Zero amount for verification
      //   note: new Uint8Array(Buffer.from("Please verify your wallet!")),
      //   suggestedParams,
      // });

      const tx = algosdk.makeApplicationCallTxnFromObject({
        from: activeAddress,
        appIndex: 1,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [],
        accounts: [],
        foreignApps: [],
        foreignAssets: [],
        note: new Uint8Array(Buffer.from("Please verify your wallet!")),
        suggestedParams,
      });




      setIsSending(true);

      try {
        const result = await transactionSigner([tx], [0]);
        console.info(`[App] ✅ Successfully sent transaction!`, result);
  
       
      } catch (error) {
        console.error('Transaction failed', error);
       
        } finally {
          setIsSending(false);
        }
      }
      catch (error) {
        console.error('Transaction failed', error);
       
      } finally {
        setIsSending(false);
      }
    };

    const sendTransaction = async () => {
      try {
        if (!activeAddress) {
          throw new Error("[App] No active account");
        }
      
        

        const at = new algosdk.AtomicTransactionComposer();
       
        
        const suggestedParams = await algodClient.getTransactionParams().do();
        
        const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: activeAddress,
          to: activeAddress,
          amount: 0, // Zero amount for testing
          note: new Uint8Array(Buffer.from("Please verify your wallet!")),
          suggestedParams,
        });
        
        at.addTransaction({ txn: transaction, signer: transactionSigner });

        setIsSending(true);
  
        try {
         
          const result = await at.execute(algodClient,4);
          
          const explorerLink = `https://testnet.explorer.perawallet.app/tx/${result.txIDs}`;
          setTransactionLink(explorerLink);
          alert(`Transaction sent! ${explorerLink}`);
          console.log(explorerLink);


          

          console.info(`[App] ✅ Successfully sent transaction!`, result);
    
         
        } catch (error) {
          console.error('Transaction failed', error);
         
          } finally {
            setIsSending(false);
          }
        }
        catch (error) {
          console.error('Transaction failed', error);
         
        } finally {
          setIsSending(false);
        }
      };


  useEffect(() => {
    const fetchBalance = async () => {
      if (activeAddress) {
        const accountInfo = await algodClient.accountInformation(activeAddress).do()
        setBalance(accountInfo.amount / 1_000_000) // Convert microAlgos to Algos
      } else {
        setBalance(null)
      }
    }
    fetchBalance()
  }, [activeAddress, algodClient])




  return (
    <>
      {activeAddress ? (
        <div className="flex justify-center items-center space-x-4 min-h-screen">
          <Button onClick={handleDisconnect} variant="outline">
            Disconnect
          </Button>
          <div className="text-sm">
            Balance: {balance !== null ? `${balance.toFixed(2)} Algo` : 'Loading...'}
          </div>
          <Button onClick={sendTransaction} disabled={isSending || transactionInProgress}>
             Send Transaction
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
        <Button onClick={handleConnect}>Connect Wallet</Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <WalletList onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

function WalletList({ onClose }: { onClose: () => void }) {
  const { wallets } = useWallet()

  const handleConnect = async (wallet: Wallet) => {
    await wallet.connect()
    onClose()
  }

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold mb-4 text-center">Connect Your Wallet</h2>
      <div className="space-y-2">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="w-full mb-2 flex justify-center">
          <Button
            key={wallet.id}
            onClick={() => handleConnect(wallet)}
            className="w-[50%] justify-center"
          >
            {wallet.metadata.name}
            <span className="flex-1" />
            <img src={wallet.metadata.icon} alt="wallet icon" className="w-6 h-6 mr-2" />
            
          </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

