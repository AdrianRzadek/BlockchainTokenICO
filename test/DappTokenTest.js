// var DappToken = artifacts.require("./DappToken.sol")
// var tokenInstance;
// contract('DappToken', function(accounts){

//     it('init the correct  values', function(){
//         return DappToken.deployed().then(function(instance){
//             tokenInstance = instance;
//             return tokenInstance.name();
//     }).then(function(name){
//         assert.equal(name, 'DApp Token', 'has the correct name');
//         return tokenInstance.symbol();
//     }).then(function(symbol){
//         assert.equal(symbol, 'DAPP', 'has the correct symbol');
//         return tokenInstance.standard();
//     }).then(function(standard){
//         assert.equal(standard, 'DApp Token v1.0', 'has the correct standard');
//         return tokenInstance.standard();   
//     });
//     })


//     it("set total supply", function(){
//         return DappToken.deployed().then(function(instance){
//             tokenInstance = instance;
//             return tokenInstance.totalSupply();
//         }).then(function(totalSupply){
//             assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1.000.000');
//              return tokenInstance.balanceOf(accounts[0]);
//          }).then(function(adminBalance){
//             assert.equal(adminBalance.toNumber(),1000000, 'alocates initial supply');
//         })
//         });


//         it("transfers token ownership", function(){
//             return DappToken.deployed().then(function(instance){
//                 tokenInstance = instance;
//                 return tokenInstance.transfer.call(accounts[1], 99999999);
//                 ;
//             }).then(assert.fail).catch(function(error){
//                 assert(error.message.includes('revert')>= 0, "error must contain revert");
//                 return tokenInstance.transfer.call(accounts[1],250000,{from:accounts[0]});
//             }).then(function(success){
//                 assert.equal(success, true, 'returns true');
//                 return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]});
//             }).then(function(receipt){
//                assert.equal(receipt.logs.length, 1, 'trrigers event 1');
//                 assert.equal(receipt.logs[0].event,'Transfer', 'trrigers event 2 transfer');
//                 assert.equal(receipt.logs[0].args._from, accounts[0],'trrigers event 3 transfer from');
//                 assert.equal(receipt.logs[0].args._to, accounts[1], 'trrigers event 4 transfer to');
//                 assert.equal(receipt.logs[0].args._value,250000,'trrigers event 5 transfer value');
//                 return tokenInstance.balanceOf(accounts[1]);
//             }).then(function(balance){
//                 assert.equal(balance.toNumber(), 250000, 'adds amount to the account');
//                 return tokenInstance.balanceOf(accounts[0]);
//             }).then(function(balance){
//                 assert.equal(balance.toNumber(),750000, 'deducts amout from sending account');
//             });
//         });

//         it('approves tokens from transfer', function(){
//             return DappToken.deployed().then(function(instance){
//                 tokenInstance = instance;
//                 return tokenInstance.approve.call(accounts[1], 100);
//             }).then(function(success){
//                 assert.equal(success, true, 'returns true');
//                 return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
//             }).then(function(receipt){
//                 assert.equal(receipt.logs.length, 1, 'trrigers event 1');
//                 assert.equal(receipt.logs[0].event,'Approval', 'approval event 2 transfer');
//                 assert.equal(receipt.logs[0].args._owner, accounts[0],'logs account the tokens are authorized by');
//                 assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs account the tokens are authorized  to');
//                 assert.equal(receipt.logs[0].args._value,100,'logs the transfer amount');
//                 return tokenInstance.allowance(accounts[0], accounts[1]);
//             }).then(function(allowance){
//                 assert.equal(allowance, 100, 'stores allowance for transfer');
//             })
//         });

//         it('handles token transfers', function(){
//             return DappToken.deployed().then(function(instance){
//                 tokenInstance = instance;
//                 fromAccount = accounts[2];
//                 toAccount = accounts[3];
//                 spendingAccount = accounts[4];
//                 //transfer some tokens to fromAccount
//                 return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
//         }).then(function(receipt){
//             //approve spendingAccount to spend 10 tokens from fromAccount
//             return tokenInstance.approve(spendingAccount, 10 , {from: fromAccount});
//         }).then(function(receipt){
//             //try transfer sth larger than spenders balance
//             return tokenInstance.transferFrom(fromAccount, toAccount,9999,{from: spendingAccount}); 
//         }).then(assert.fail).catch(function(error){
//             assert(error.message.includes('revert') >= 0 ,'canot transfer value larger then balance');
//             //try transfering sth larger than the approved amount
//             return tokenInstance.transferFrom(fromAccount, toAccount,20, {from: spendingAccount})
//         }).then(assert.fail).catch(function(error){
//             assert(error.message.includes('revert')>= 0, 'cannot transfer value larger than approved amount');
//             return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
//         }).then(function(success){
//             assert.equal(success, true);
//             return tokenInstance.transferFrom(fromAccount,toAccount,10, {from:spendingAccount});
//         }).then(function(receipt){
//             assert.equal(receipt.logs.length, 1, 'trrigers event 1');
//             assert.equal(receipt.logs[0].event,'Transfer', 'approval event 2 transfer');
//             assert.equal(receipt.logs[0].args._from, fromAccount,'logs account the tokens are transfered from');
//             assert.equal(receipt.logs[0].args._to, toAccount, 'logs account the tokens are transferred to');
//             assert.equal(receipt.logs[0].args._value,10,'logs the transfer amount');
//             return tokenInstance.balanceOf(fromAccount);
//         }).then(function(balance){
//             assert.equal(balance.toNumber(), 90, 'deducts the amount from the spending account');
//             return tokenInstance.balanceOf(toAccount);
//         }).then(function(balance){
//             assert.equal(balance.toNumber(),10, 'adds the amout from receiving account');
//         return tokenInstance.allowance(fromAccount,spendingAccount);
//     }).then(function(allowance){
//         assert.equal(allowance, 0, 'stores allowance for transfer');
//     })
//         });
//     });

