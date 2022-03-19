//

require("@nomiclabs/hardhat-waffle");

module.exports = {
	solidity: "0.8.0",
	networks: {
		rinkeby: {
			url: "https://eth-rinkeby.alchemyapi.io/v2/jWdGIrhFvbH85b2OdeSCVinxzXXnSPJk",
			accounts: [
				"c436d2032e3ffcba20dbb11d4253312e54d43925b3f4563755c5f0cbf0f0ce08",
			],
		},
	},
};
