import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractAbi, contractAddress } from "../utils/constants";
import { client } from "../utils/sanityClient";
import toast, { Toaster } from "react-hot-toast";

export const TransactionContext = React.createContext();

let ethereum;
if (typeof window !== "undefined") {
	ethereum = window.ethereum;
}

// Contract Related
const getContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract(
		contractAddress,
		contractAbi,
		signer
	);

	//console.log(provider, signer, transactionContract);
	return transactionContract;
};

// Provider
export const TransactionProvider = ({ children }) => {
	const [currentWallet, setCurrentWallet] = useState({});
	const [formData, setFormData] = useState({
		addressTo: "",
		amount: "",
		keyword: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem("transactionCount")
	);

	// Updating forn data value on real time
	const handleChange = (e, name) => {
		setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
	};

	// Toasts
	const transactionSuccess = (toastHandler = toast) => {
		toastHandler.success(`Eth Transfer Confirmed ✔✔✔`, {
			style: {
				background: "#04111d",
				color: "#fff",
			},
		});
	};
	const walletConnectionSuccess = (toastHandler = toast) => {
		toastHandler.info(`📢 Wallet Connected..`, {
			style: {
				background: "#04111d",
				color: "#fff",
			},
		});
	};

	// Check for is logged in User exist in database, if not then adding it.
	useEffect(() => {
		if (!currentWallet) return;
		(async () => {
			const userDoc = {
				_type: "users",
				_id: currentWallet,
				userName: "Unnamed",
				address: currentWallet,
			};

			await client.createIfNotExists(userDoc);
		})();
	}, [currentWallet]);

	// Check for any connected wallet.
	const checkForConnectedWallet = async () => {
		try {
			if (!ethereum)
				return alert("Please Install Matamask To Use Our Services.");

			const account = await ethereum.request({ method: "eth_accounts" });
			if (account.length) {
				setCurrentWallet(account[0]);
			} else console.log("No accounts found.");
		} catch (error) {
			console.error(error);
			throw new Error("No Ethereum Object Found.");
		}
	};

	// Wallet connection with site
	const connectWallet = async () => {
		try {
			if (!ethereum)
				return alert("Please Install Matamask To Use Our Services.");

			const account = await ethereum.request({ method: "eth_requestAccounts" });
			setCurrentWallet(account[0]);
		} catch (error) {
			console.error(error);
			throw new Error("No Ethereum Object Found.");
		}
	};

	// Save Transaction Record to Sanity Database.
	const saveTransaction = async (
		txHash,
		amount,
		fromAddress = currentWallet,
		toAddress
	) => {
		const txDoc = {
			_type: "transactions",
			_id: txHash,
			fromAddress: fromAddress,
			toAddress: toAddress,
			timestamp: new Date(Date.now()).toISOString(),
			txHash: txHash,
			amount: parseFloat(amount),
		};

		await client.createIfNotExists(txDoc);

		await client
			.patch(currentWallet)
			.setIfMissing({ transactions: [] })
			.insert("after", "transactions[-1]", [
				{
					_key: txHash,
					_ref: txHash,
					_type: "reference",
				},
			])
			.commit();

		return;
	};

	// Send Ethereum Function.
	const sendTransaction = async () => {
		if (!ethereum) return alert("Please Install Metamask");
		try {
			const { addressTo, amount, keyword, message } = formData;
			const transactionContract = getContract();
			const parsedAmount = ethers.utils.parseEther(amount);

			// sending Ethereum from one address to another
			await ethereum.request({
				method: "eth_sendTransaction",
				params: [
					{
						from: currentWallet,
						to: addressTo,
						gas: "0x5208", // 21000 gwei
						value: parsedAmount._hex,
					},
				],
			});

			// registering addresss to blockchain
			const transactionHash = await transactionContract.addToBlock(
				addressTo,
				parsedAmount
			);

			setIsLoading(true);
			console.log(`Loading - ${transactionHash.hash}`);
			await transactionHash.wait();

			await saveTransaction(
				transactionHash.hash,
				amount,
				currentWallet,
				addressTo
			);

			transactionSuccess();
			setIsLoading(false);
			console.log(`success -${transactionHash.hash}`);

			transactionCount = await transactionContract.getTransactionCount();
			setTransactionCount(transactionCount.toNumber());
		} catch (error) {
			console.error(error);
			throw new Error("nO Ethereum Object found.");
		}
	};

	useEffect(() => {
		checkForConnectedWallet();
	}, [currentWallet]);

	return (
		<TransactionContext.Provider
			value={{
				connectWallet,
				currentWallet,
				formData,
				handleChange,
				sendTransaction,
				isLoading,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
