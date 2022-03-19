import React, { useContext } from "react";
import {
	AiFillPlayCircle,
	AiOutlineGithub,
	AiFillLinkedin,
} from "react-icons/ai";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from ".";
import toast, { Toaster } from "react-hot-toast";

const companyCommonStyles =
	"min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
	<input
		placeholder={placeholder}
		type={type}
		step="0.0001"
		value={value}
		onChange={(e) => handleChange(e, name)}
		className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
	/>
);

const Welcome = () => {
	const {
		connectWallet,
		currentWallet,
		formData,
		handleChange,
		sendTransaction,
		isLoading,
	} = useContext(TransactionContext);

	const handleSubmit = (e) => {
		const { addressTo, amount, keyword, message } = formData;
		if (!addressTo || !amount || !keyword || !message) return;

		sendTransaction();
	};

	return (
		<div className="flex w-full justify-center items-center">
			<div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
				<div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
					<h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
						Send Crypto <br /> across the world
					</h1>
					<p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
						Explore the crypto world. Transfer your Ether easily on Etheorr...
					</p>

					{currentWallet.length ? (
						<button
							type="button"
							className="flex flex-row justify-center items-center my-5 bg-[#101420] p-3 rounded-full"
						>
							<AiFillPlayCircle className="text-white mr-2" />
							<p className="text-white text-base font-semibold">Connected...</p>
						</button>
					) : (
						<button
							type="button"
							className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
							onClick={() => connectWallet()}
						>
							<AiFillPlayCircle className="text-white mr-2" />
							<p className="text-white text-base font-semibold">
								Connect Wallet
							</p>
						</button>
					)}
					<div className="flex items-center">
						<a
							href="#"
							class="bg-purple-500 hover:bg-purple-400 border-b-4 border-purple-700 hover:border-purple-500 text-white text-white text-center py-1 px-3 rounded flex items-center mr-3"
						>
							<AiOutlineGithub className="h-7 mr-1" />
							Github
						</a>
						<a
							href="#"
							class="bg-purple-500 hover:bg-purple-400 border-b-4 border-purple-700 hover:border-purple-500 text-white text-white text-center py-1 px-3 rounded flex items-center"
						>
							<AiFillLinkedin className="h-7 mr-1" />
							LinkedIn
						</a>
					</div>
				</div>

				<div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
					<div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
						<Input
							placeholder="Address To"
							name="addressTo"
							type="text"
							handleChange={handleChange}
						/>
						<Input
							placeholder="Amount (ETH)"
							name="amount"
							type="number"
							handleChange={handleChange}
						/>
						<Input
							placeholder="Alias"
							name="keyword"
							type="text"
							handleChange={handleChange}
						/>
						<Input
							placeholder="Enter Message"
							name="message"
							type="text"
							handleChange={handleChange}
						/>

						<div className="h-[1px] w-full bg-gray-400 my-2" />

						{isLoading ? (
							<Loader />
						) : (
							<button
								type="button"
								onClick={handleSubmit}
								className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
							>
								Send now
							</button>
						)}
						<Toaster position="top-center" reverseOrder={false} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
