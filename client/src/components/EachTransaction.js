import { useContext } from "react";
import { HiUpload } from "react-icons/hi";
import { TransactionContext } from "../context/TransactionContext";
import { FiArrowUpRight } from "react-icons/fi";

const style = {
	eventItem: `flex px-4 py-5 font-medium`,
	event: `flex items-center`,
	eventIcon: `mr-2 text-xl`,
	eventName: `text-lg font-semibold`,
	eventPrice: `flex items-center`,
	eventPriceValue: `text-lg`,
	ethLogo: `h-5 mr-2`,
	etherscanLink: `flex items-center text-[#2172e5]`,
};

const EachTransaction = ({ transaction }) => {
	const { currentWallet } = useContext(TransactionContext);
	//console.log(transaction);
	return (
		<div className={style.eventItem}>
			<div className={`${style.event} flex-[1]`}>
				<div className={style.eventIcon}>
					<HiUpload />
				</div>
				<div className={style.eventName}>Send</div>
			</div>
			<div className={`${style.eventPrice} flex-[1]`}>
				<img
					src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
					alt="eth"
					className={style.ethLogo}
				/>
				<div className={style.eventPriceValue}>{transaction.amount}</div>
			</div>

			<div className={`flex-[4]`}>{transaction.toAddress}</div>
			<div className={`flex-[2]`}>
				{new Date(transaction.timestamp).toLocaleString("en-US", {
					timeZone: "PST",
					hour12: true,
					timeStyle: "short",
					dateStyle: "long",
				})}
			</div>
			<div className={`${style.etherscanLink} flex-[1]`}>
				<a
					href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
					target="_blank"
					rel="noreferrer"
					className={style.etherscanLink}
				>
					Etherscan
					<FiArrowUpRight />
				</a>
			</div>
		</div>
	);
};

export default EachTransaction;
