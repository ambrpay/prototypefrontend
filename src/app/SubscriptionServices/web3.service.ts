import { Injectable } from '@angular/core';
import { COMPILER_OPTIONS } from '@angular/core/src/linker/compiler';






@Injectable()
export class Web3Service {
  web3: any;

  connect() {

      console.log('do we have web3js?', window['web3js']);
      this.web3 = window['web3js'];

  }

  getWeb3() {
    return this.web3;
  }

  getAccount() {

    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(( e, o) => {
        console.log(o, e);
        return resolve(o[0]);
       });
    });
  }

  createContractInstance(subContract, acc) {

    return new Promise((resolve, reject) => {

      const c = this.web3.eth.contract(subContract.abi);
      c.new({
        from: acc ,
        data: subContract.bytecode,
        gasLimit: '0x21000',
        gas: '0x470000'
      },
      function (e, i) {
        console.log('e and i ',e,i);
        if (!e) {
          console.log(i);
          console.log(e);
          if (typeof i.address !== 'undefined') {
            console.log('Contract mined! address: ' + i.address + ' transactionHash: ' + i.transactionHash);
            return resolve(i);
          } else {
            console.log('undef why?');
            console.log('we wait a few!');
          }
        }
      });
    });
  }

  getAccountBalance() {
    return new Promise((resolve, reject) => {
      this.getAccount()
      .then((account) => {
        if (!account) { return resolve(null); }
        this.web3.eth.getBalance(account, ( e, o) => {
          const value = this.web3.fromWei(o);
          return resolve(value);
         });
      });
    });
  }

  pay (contractAddress: any, amount: any) {
    return new Promise((resolve, reject) => {
      this.getAccount()
      .then((account) => {
        if (!account) { return resolve(null); }
        const value = this.web3.toWei(amount);
        this.web3.eth.sendTransaction({ from: account, to: contractAddress, value: value },
          (e, o) => {
            return resolve(o);
          });
      });
    });
  }



}
