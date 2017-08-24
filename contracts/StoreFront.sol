pragma solidity ^0.4.2;


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract StoreFront {
	mapping (address => uint) balances;
	uint    public id;

	event LogInventory(address _merchant, string _name, uint _idInventory, uint _price, uint256 _quantity);

	struct StoreFrontInventory {
		address productMerchant;
		string productName;
		uint productPrice;
		uint productQuantity;
	    }

    	mapping(uint=>StoreFrontInventory) private storeFront;

	function StoreFront() {
		balances[tx.origin] = 10000;
	}

	function addProduct(string productN, uint productP, uint productQ) returns(bool sufficient) {
		
		id++;
        StoreFrontInventory memory newProduct = storeFront[id];
        newProduct.productMerchant = msg.sender;
        newProduct.productName = productN;
        newProduct.productPrice = productP;
        newProduct.productQuantity = productQ;
        storeFront[id] = newProduct;
		
	LogInventory(msg.sender,productN,id,productP,productQ);
		
		return true;
	}

	function buyProduct(uint productID, uint quantity) public payable returns (bool success) {
         
        StoreFrontInventory memory toVerify = storeFront[productID];
        assert(toVerify.productQuantity>=quantity);
        toVerify.productQuantity -= quantity;
        storeFront[productID] = toVerify;
        LogInventory(msg.sender, toVerify.productName, productID, toVerify.productPrice, toVerify.productQuantity );
        return true;
    }

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}

	function getID() returns(uint) {
		return id;
	}

	function getProductDetails(uint id) returns(bool success) {
		StoreFrontInventory memory toVerify = storeFront[id];
		LogInventory(msg.sender, toVerify.productName, id, toVerify.productPrice, toVerify.productQuantity);
		return true;
	}
}
