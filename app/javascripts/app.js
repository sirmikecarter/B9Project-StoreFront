// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import storefront_artifacts from '../../build/contracts/StoreFront.json'

// StoreFront is our usable abstraction, which we'll use through the code below.
var StoreFront = contract(storefront_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var numProducts = 0;
var numTrans = 0;
var data = new Array();

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the StoreFront abstraction for Use.
    StoreFront.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
      self.setAccounts();


      var meta;
      StoreFront.deployed().then(function(instance) {
      meta = instance;
      return meta.getID.call({from: web3.eth.coinbase, gas: 300000});
      }).then(function(value) {
                  
          numProducts = value.valueOf();

          if (numProducts >= 0)
          {

            self.updateInventoryTable(0);
          }
      var meta;
      StoreFront.deployed().then(function(instance) {
      meta = instance;
      return meta.getTransLength.call({from: web3.eth.coinbase, gas: 300000});
      }).then(function(value) {
                  
          numTrans = value.valueOf();

          if (numTrans >= 1)
          {
            //console.log(numTrans);
            self.updateTransactionTable(0);
          }


          }).catch(function(e) {
            console.log(e);
            self.setStatus("Error sending coin; see log.");
          }); 

          }).catch(function(e) {
            console.log(e);
            self.setStatus("Error sending coin; see log.");
          }); 






      });

  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setAccounts: function() {
////////////////////////////////////////////////////// Populate User Accounts and Currency

    var merchantSelect = document.getElementById("merchantSelect");
    var buyerSelect = document.getElementById("buyerSelect");
    var coBuyerSelect = document.getElementById("coBuyerSelect");

    for (var i = 0; i <= 1; i++) {
  var option = document.createElement("option");
  option.text = accounts[i];
  option.value = accounts[i];
  merchantSelect.add(option);
    }

    for (var i = 2; i <= 4; i++) {
  var option = document.createElement("option");
  option.text = accounts[i];
  option.value = accounts[i];
  buyerSelect.add(option);
   }

    for (var i = 1; i <= 4; i++) {
  var option = document.createElement("option");

        if (i == 1)
  {

  option.text = "None";
  option.value = "None";
        coBuyerSelect.add(option);

  }else
  {

  option.text = accounts[i];
  option.value = accounts[i];
        coBuyerSelect.add(option);
  }


    }


    //$("#ethStoreAddress").html(ethStore.address);

    //Currency
    var currencySelect = document.getElementById("currencySelect");

    var option1 = document.createElement("option");
    option1.text = "ETH";
    option1.value = "ETH";
    currencySelect.add(option1);
    var option2 = document.createElement("option");
    option2.text = "META";
    option2.value = "META";
    currencySelect.add(option2);


  

////////////////////////////////////////////////////// End Populate User Accounts and Currency
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    StoreFront.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });

    var meta;
    StoreFront.deployed().then(function(instance) {
      meta = instance;
      //console.log(meta.address);

      $("#StoreFrontAddress").html(meta.address);

      $("#StoreFrontBalance").html(web3.fromWei(web3.eth.getBalance(meta.address).toNumber(), 'ether'));

      
    });

  var table = document.getElementById("balances").getElementsByTagName('tbody')[0];
    $("#balances tbody").empty();

    accounts.forEach(function(account) {
      var row = table.insertRow(0);
      var balance = web3.eth.getBalance(account);
      //console.log(account, balance);
      balance = web3.fromWei(balance.toNumber(), 'ether');

      var addressCell = row.insertCell(0);
      var balanceCell = row.insertCell(1);
      var balanceMetaCell = row.insertCell(2);

      addressCell.innerHTML = account;
      balanceCell.innerHTML = balance;

    meta.getBalance.call(account, {from: account}).then(function(value) {
      var balance_element = document.getElementById("balance");
      balanceMetaCell.innerHTML = value.valueOf();
    }).catch(function(e) {
      //console.log(e);
    });

    });

  },

  setInventory: function(data) {
            //console.log(data._merchant);
            //console.log(data._name);
            //console.log(data._idInventory.toNumber());
            //console.log(data._price.toNumber());
            //console.log(data._quantity.toNumber());
    var productSelect = document.getElementById("productSelect");

       var option = document.createElement("option");
        option.text = data._name;
        option.value = data._idInventory.toNumber();
        productSelect.add(option);  


    // Update table
    var table = document.getElementById("inventory").getElementsByTagName('tbody')[0];
    $('table#inventory tr#inventory-' + data._idInventory.toNumber()).remove();

    var row = table.insertRow(0);
    row.id = 'inventory-' + data._idInventory.toNumber();

    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var quantityCell = row.insertCell(2);
    var priceCell = row.insertCell(3);
    var merchantCell = row.insertCell(4);
    var removeCell = row.insertCell(5);


    idCell.innerHTML = data._idInventory.toNumber();
    nameCell.innerHTML = data._name;
    quantityCell.innerHTML = data._quantity.toNumber();
    priceCell.innerHTML = data._price.toNumber();
    merchantCell.innerHTML = data._merchant;
    removeCell.innerHTML = '<button class="Remove" onclick="App.removeProduct(' + data._idInventory.toNumber() + ')" id="RemoveButton" data-id="' + data._idInventory.toNumber() + '">Remove</button>';




  },
    setTransaction: function(data) {
            //console.log(data._merchant);
            //console.log(data._name);
            //console.log(data._idInventory.toNumber());
            //console.log(data._price.toNumber());
            //console.log(data._quantity.toNumber());


// Update table
    var table = document.getElementById("transactions").getElementsByTagName('tbody')[0];
    //$('table#transactions tr#transactions-' + product.productID).remove();
    var currencySelect = $("#currencySelect option:selected").val();

    var row = table.insertRow(0);

    row.id = 'product-' + data._idInventory.toNumber();

    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var quantityCell = row.insertCell(2);
    var priceCell = row.insertCell(3);
    var currencyCell = row.insertCell(4);
    var buyerCell = row.insertCell(5);
    var cobuyerCell = row.insertCell(6);
    //var buttonCell = row.insertCell(7);
    
    idCell.innerHTML = data._idInventory.toNumber();
    nameCell.innerHTML = data._name;
    quantityCell.innerHTML = "1";
    priceCell.innerHTML = data._price;
    buyerCell.innerHTML = data._buyer; 

    //if (coBuyerVar == "True")
    //{
    //quantityCell.innerHTML = "0.5";
    //priceCell.innerHTML = productPrice/2;
    //buyerCell.innerHTML = productBuyer; 
    //}

    //if (coBuyerVar == "False")
    //{
    //quantityCell.innerHTML = "1";
    //priceCell.innerHTML = productPrice;
    //buyerCell.innerHTML = productBuyer;
    //}

    //currencyCell.innerHTML = currencyName; 
    currencyCell.innerHTML = currencySelect;   
    cobuyerCell.innerHTML = data._CoBuyer;




  },

  removeProduct: function(data) {
    
    $('table#inventory tr#inventory-' + data).remove();

    $('#productSelect option[value=' + data + ']').remove();
    var self = this;
    //console.log(data);

    //products.length--;

    //$("#CashOutButton").hide();

    //showBalances();

        var meta;
    StoreFront.deployed().then(function(instance) {
      meta = instance;

      return meta.removeID(data, {from: web3.eth.coinbase, gas: 300000});

    }).then(function() {
      self.setStatus("Transaction complete!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  
  

  },

  updateInventoryTable: function(indexValue) {
    var self = this;

    




          var meta;
          StoreFront.deployed().then(function(instance) {
          meta = instance;
            var transfers = meta.LogInventory({fromBlock: "latest"});
            transfers.watch(function(error, result) {
              // This will catch all Transfer events, regardless of how they originated.
              if (error == null && result.args._name != "" ) {

                self.setInventory(result.args);
                //self.setData(result.args);
              }
            transfers.stopWatching();
            });            
          return meta.getProductDetails(indexValue, {from: web3.eth.coinbase, gas: 300000});
      
        }).then(function() {
          self.setStatus("Transaction complete!");              


                  var meta;
                StoreFront.deployed().then(function(instance) {
                  meta = instance;

                  return meta.getID.call({from: web3.eth.coinbase, gas: 300000});
                }).then(function(value) {
                  
                  numProducts = value.valueOf();

                  if (indexValue < numProducts)
                  {

                    self.updateInventoryTable(indexValue+1);
                  }

                  //console.log(indexValue);

                  //console.log(numProducts);


                  }).catch(function(e) {
                  console.log(e);
                  self.setStatus("Error sending coin; see log.");
                  });

          //self.refreshBalance();
        }).catch(function(e) {
          console.log(e);
          self.setStatus("Error sending coin; see log.");
        });
       


 


  },

    updateTransactionTable: function(indexValue) {
    var self = this;

    




          var meta;
          StoreFront.deployed().then(function(instance) {
          meta = instance;
            var transfers = meta.LogTransaction({fromBlock: "latest"});
            transfers.watch(function(error, result) {
              // This will catch all Transfer events, regardless of how they originated.
              //if (error == null && result.args._name != "" ) {

                self.setTransaction(result.args);
                //self.setData(result.args);
                //console.log(result.args._buyer);
              //}
            transfers.stopWatching();
            });            
          return meta.getTransDetail(indexValue, {from: web3.eth.coinbase, gas: 300000});
      
        }).then(function() {
          self.setStatus("Transaction complete!");     


                var meta;
                StoreFront.deployed().then(function(instance) {
                  meta = instance;

                  return meta.getTransLength.call({from: web3.eth.coinbase, gas: 300000});
                }).then(function(value) {
                  
                  numTrans = value.valueOf() - 1;
                  //console.log(numTrans);

                  if (indexValue < numTrans)
                  {

                    self.updateTransactionTable(indexValue+1);
                  }

                  //console.log(indexValue);

                  //console.log(numProducts);


                  }).catch(function(e) {
                  console.log(e);
                  self.setStatus("Error sending coin; see log.");
                  });         



          //self.refreshBalance();
        }).catch(function(e) {
          console.log(e);
          self.setStatus("Error sending coin; see log.");
        });
       


 


  },

    buyProduct: function() {
    var self = this;

        var productBuyer = $("#buyerSelect option:selected").val();
        var productCoBuyer = $("#coBuyerSelect option:selected").val();
        var productSelect = document.getElementById("productSelect").value;
        var currencySelect = $("#currencySelect option:selected").val();


        if(productCoBuyer == "None")
        {

          if(currencySelect == "ETH")
          {

          }
          else if(currencySelect == "META")
          {

          }


        }else {

          if(currencySelect == "ETH")
          {

          }
          else if(currencySelect == "META")
          {

          }


        }






//$('#productSelect option[value=' + data + ']').remove();

        var meta;
                StoreFront.deployed().then(function(instance) {
                  meta = instance;

                  return meta.getPrice.call(productSelect, {from: web3.eth.coinbase, gas: 300000});
                }).then(function(value) {
                  data[1] = productCoBuyer;
                        if(productCoBuyer != "None")
                        {
                              data[0] = value.valueOf() / 2;

                        }else{
                              data[0] = value.valueOf();

                        }


                  
                  //console.log(indexValue);

                 
                            var meta;                            
                    
              StoreFront.deployed().then(function(instance) {
                meta = instance;
                  var transfers = meta.LogInventory({fromBlock: "latest"});
                  transfers.watch(function(error, result) {
                    // This will catch all Transfer events, regardless of how they originated.
                    if (error == null) {
                      self.setInventory(result.args);
                     
                      //self.setData(result.args);
                    }
                    transfers.stopWatching();
                  });

                  var transfers2 = meta.LogTransaction({fromBlock: "latest"});
                  transfers2.watch(function(error, result) {
                    // This will catch all Transfer events, regardless of how they originated.
                    if (error == null) {
                      self.setTransaction(result.args);
                      
                      
                      //self.setData(result.args);
                    }
                    transfers2.stopWatching();
                  });

                return meta.buyProduct(productSelect, 1, productCoBuyer, {from: productBuyer, gas: 300000, value: data[0] });
              }).then(function() {
                self.setStatus("Transaction complete!");
                self.refreshBalance();

                if(productCoBuyer != "None")
                        {

                      var meta;                            
                    
                      StoreFront.deployed().then(function(instance) {
                        meta = instance;


                        return meta.sendCoBuyerTransaction({from: productCoBuyer, gas: 300000, value: data[0] });
                      }).then(function() {
                        self.setStatus("Transaction complete!");
                        self.refreshBalance();



                      }).catch(function(e) {
                        console.log(e);
                        self.setStatus("Error sending coin; see log.");
                      });


               }



              }).catch(function(e) {
                console.log(e);
                self.setStatus("Error sending coin; see log.");
              });


  
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });                   




                            

 
},


  addProduct: function() {
    var self = this;

        var productName = document.getElementById("productName").value;
        var productPrice = parseInt(document.getElementById("productPrice").value);
        var productQuantity = parseInt(document.getElementById("productQuantity").value);
        var productMerchant = $("#merchantSelect option:selected").val();

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    StoreFront.deployed().then(function(instance) {
      meta = instance;
        var transfers = meta.LogInventory({fromBlock: "latest"});
        transfers.watch(function(error, result) {
          // This will catch all Transfer events, regardless of how they originated.
          if (error == null) {
            self.setInventory(result.args);
            //self.setData(result.args);
          }
          transfers.stopWatching();
        });
      return meta.addProduct(productName, productPrice, productQuantity, {from: productMerchant, gas: 300000});

    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 StoreFront, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
