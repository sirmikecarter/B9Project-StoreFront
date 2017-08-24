pragma solidity ^0.4.2;


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract StoreFront {
	mapping (address => uint) balances;
	uint    public id;

	event LogInventory(address _merchant, string _name, uint _idInventory, uint _price, uint256 _quantity);
	event LogTransaction(address _merchant, address _buyer, string _name, uint _idInventory, uint _price, uint256 _quantity);
	
	struct StoreFrontInventory {
		address productMerchant;
		string productName;
		uint productPrice;
		uint productQuantity;
	    }

	struct StoreFrontTransaction {
		address productMerchant;
		address productBuyer;
		uint productID;
		string productName;
		uint productPrice;
		uint productQuantity;
        
    }

    mapping(uint=>StoreFrontInventory) private storeFront;

	StoreFrontTransaction[] public storeFrontTransaction;

    
    

	function StoreFront() {
		balances[tx.origin] = 10000;
	}

	function addProduct(string productN, uint productP, uint productQ) returns(bool sufficient) {
		
		
        StoreFrontInventory memory newProduct = storeFront[id];
        newProduct.productMerchant = msg.sender;
        newProduct.productName = productN;
        newProduct.productPrice = productP;
        newProduct.productQuantity = productQ;
        storeFront[id] = newProduct;      		
		LogInventory(msg.sender,productN,id,productP,productQ);
		id++;
		
		return true;
	}

	function buyProduct(uint productID, uint quantity) public payable returns (bool success) {
         
        StoreFrontInventory memory toVerify = storeFront[productID];
        assert(toVerify.productQuantity>=quantity);
        toVerify.productQuantity -= quantity;
        storeFront[productID] = toVerify;
        LogInventory(toVerify.productMerchant, toVerify.productName, productID, toVerify.productPrice, toVerify.productQuantity );
        
        StoreFrontTransaction memory newTransaction;
        newTransaction.productMerchant = toVerify.productMerchant;
        newTransaction.productBuyer = msg.sender;
        newTransaction.productID = productID;
        newTransaction.productName = toVerify.productName;
        newTransaction.productPrice = toVerify.productPrice;
        newTransaction.productQuantity = quantity;
        storeFrontTransaction.push(newTransaction);
        LogTransaction(toVerify.productMerchant, newTransaction.productBuyer, toVerify.productName, productID, toVerify.productPrice, toVerify.productQuantity );
        
        return true;
    }

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}

	function getPrice(uint idPrice) returns(uint) {

		StoreFrontInventory memory toVerify = storeFront[idPrice];
		return toVerify.productPrice;
	}

	function getTransLength() returns(uint) {

		return storeFrontTransaction.length;
	}

	function getTransDetail(uint idTrans) returns(bool success) {

		LogTransaction(storeFrontTransaction[idTrans].productMerchant, storeFrontTransaction[idTrans].productBuyer, storeFrontTransaction[idTrans].productName, storeFrontTransaction[idTrans].productID, storeFrontTransaction[idTrans].productPrice, storeFrontTransaction[idTrans].productQuantity );
		return true;
	}

	function removeID(uint idRemove) returns(bool success) {

		delete storeFront[idRemove];
		return true;
	}

	function getID() returns(uint) {
		return id;
	}

	function getProductDetails(uint idDetail) returns(bool success) {
		StoreFrontInventory memory toVerify = storeFront[idDetail];
		LogInventory(msg.sender, toVerify.productName, idDetail, toVerify.productPrice, toVerify.productQuantity);
		return true;
	}
}
