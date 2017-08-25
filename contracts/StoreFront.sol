pragma solidity ^0.4.2;

contract StoreFront {
	mapping (address => uint) balances;
	uint    public id;

	event LogInventory(address _merchant, string _name, uint _idInventory, uint _price, uint256 _quantity, uint _amountOwed);
	event LogTransaction(address _merchant, address _buyer, string _CoBuyer, string _name, uint _idInventory, uint _price, uint256 _quantity);
	
	struct StoreFrontInventory {
		address productMerchant;
		string productName;
		uint productPrice;
		uint productQuantity;
		uint amountOwed;
	    }

	struct StoreFrontTransaction {
		address productMerchant;
		address productBuyer;
		string productCoBuyer;
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
        newProduct.amountOwed = 0;
        storeFront[id] = newProduct;      		
		LogInventory(msg.sender,productN,id,productP,productQ,newProduct.amountOwed);
		id++;
		
		return true;
	}

	function buyProduct(uint productID, uint quantity, string coBuyerAddress) public payable returns (bool success) {
         
        StoreFrontInventory memory toVerify = storeFront[productID];
        assert(toVerify.productQuantity>=quantity);
        toVerify.productQuantity -= quantity;
        toVerify.amountOwed += toVerify.productPrice * quantity;
        storeFront[productID] = toVerify;
        LogInventory(toVerify.productMerchant, toVerify.productName, productID, toVerify.productPrice, toVerify.productQuantity, toVerify.amountOwed );
        
        StoreFrontTransaction memory newTransaction;
        newTransaction.productMerchant = toVerify.productMerchant;
        newTransaction.productBuyer = msg.sender;
        newTransaction.productCoBuyer = coBuyerAddress;
        newTransaction.productID = productID;
        newTransaction.productName = toVerify.productName;
        newTransaction.productPrice = toVerify.productPrice;
        newTransaction.productQuantity = quantity;
        storeFrontTransaction.push(newTransaction);
        LogTransaction(toVerify.productMerchant, newTransaction.productBuyer, newTransaction.productCoBuyer, toVerify.productName, productID, toVerify.productPrice, toVerify.productQuantity );
        
        return true;
    }

    function sendCoBuyerTransaction() public payable returns (bool success) {
         
                
        return true;
    }

    function widthdrawFunds(uint idWithdraw, uint amountWithdraw) public returns(bool success) {
        
        StoreFrontInventory memory toVerify = storeFront[idWithdraw];
        toVerify.amountOwed = 0;
        msg.sender.transfer(amountWithdraw);
        return true;
    }

    function getMerchant(uint idGetMerchant) public returns(bool success) {
		StoreFrontInventory memory toVerify = storeFront[idGetMerchant];
		LogInventory(toVerify.productMerchant, toVerify.productName, idGetMerchant, toVerify.productPrice, toVerify.productQuantity, toVerify.amountOwed );
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

		LogTransaction(storeFrontTransaction[idTrans].productMerchant, storeFrontTransaction[idTrans].productBuyer, storeFrontTransaction[idTrans].productCoBuyer, storeFrontTransaction[idTrans].productName, storeFrontTransaction[idTrans].productID, storeFrontTransaction[idTrans].productPrice, storeFrontTransaction[idTrans].productQuantity );
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
		LogInventory(msg.sender, toVerify.productName, idDetail, toVerify.productPrice, toVerify.productQuantity, toVerify.amountOwed);
		return true;
	}
}
