import { CgArrowsExchangeV } from "react-icons/cg";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useContext, useState, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { client } from "../utils/sanityClient";
import EachTransaction from "./EachTransaction";

const style = {
	main: `p-4`,
	wrapper: `w-full mt-4 border border-[#151b22] rounded-xl bg-[#303339] overflow-hidden`,
	title: `bg-[#262b2f] px-6 py-4 flex items-center text-white text-gradient`,
	titleLeft: `flex-1 flex items-center text-xl font-bold`,
	titleIcon: `text-3xl mr-2`,
	titleRight: `text-xl`,
	filter: `flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]`,
	filterTitle: `flex-1`,
	tableHeader: `flex w-full bg-[#262b2f] border-y border-[#151b22] mt-8 px-4 py-1`,
	eventItem: `flex px-4`,
	ethLogo: `h-5 mr-2`,
	accent: `text-[#2081e2]`,
};

const TransactionHistory = () => {
	const { currentWallet, isLoading } = useContext(TransactionContext);
	const [toggle, setToggle] = useState(true);
	const [transactionHistory, setTransactionHistory] = useState([]);

	useEffect(() => {
		(async () => {
			if (!isLoading && currentWallet) {
				const query = `
          *[_type=="users" && _id == "${currentWallet}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `;

				const clientRes = await client.fetch(query);

				setTransactionHistory(clientRes[0].transactionList);
				console.log(clientRes[0].transactionList);
			}
		})();
	}, [isLoading, currentWallet]);
	console.log(transactionHistory);
	return (
		<div className={style.main}>
			<div className={style.wrapper}>
				<div className={style.title} onClick={() => setToggle(!toggle)}>
					<div className={style.titleLeft}>
						<span className={style.titleIcon}>
							<CgArrowsExchangeV />
						</span>
						Past Transactions
					</div>
					<div className={style.titleRight}>
						{toggle ? <AiOutlineUp /> : <AiOutlineDown />}
					</div>
				</div>
				{toggle && (
					<div className={style.activityTable}>
						<div className={style.filter}>
							<div className={style.filterTitle}>Filter</div>
							<div className={style.filterIcon}>
								{" "}
								<AiOutlineDown />{" "}
							</div>
						</div>
						<div className={style.tableHeader}>
							<div className={`${style.tableHeaderElement} flex-[1]`}>
								Event
							</div>
							<div className={`${style.tableHeaderElement} flex-[1]`}>
								Amount
							</div>

							<div className={`${style.tableHeaderElement} flex-[4]`}>To</div>
							<div className={`${style.tableHeaderElement} flex-[2]`}>Date</div>
							<div className={`${style.tableHeaderElement} flex-[1]`}>
								Veiw On
							</div>
						</div>

						{transactionHistory &&
							transactionHistory?.map((transaction, index) => (
								<EachTransaction key={index} transaction={transaction} />
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionHistory;
