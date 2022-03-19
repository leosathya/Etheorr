import { Navbar, Welcomme, Loader, TransactionHistory } from "./components";

function App() {
	return (
		<div className="min-h-screen">
			<div className="gradient-bg-welcome">
				<Navbar />
				<Welcomme />
				<TransactionHistory />
			</div>
		</div>
	);
}

export default App;
