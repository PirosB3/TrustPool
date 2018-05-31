import React, { Component } from 'react'
import TrustPoolJson from '../build/contracts/TrustPoolEvent.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contractAddress: null,
      depositAmount: null,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const TrustPool = contract(TrustPoolJson)
    TrustPool.setProvider(this.state.web3.currentProvider)

    // Declaring this in the closure for later access
    window.contractInstance = null

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      TrustPool.deployed().then((instance) => {
        window.contractInstance = instance
        console.log("Variable contractInstance has been added to global scope");
        return window.contractInstance.depositAmount.call()
      }).then((result) => {
        return this.setState({
           contractAddress: window.contractInstance.address,
           depositAmount: result.c[0],
         })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Trust Pool</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>TrustPool</h1>
              <p>The contract is deployed at: {this.state.contractAddress}</p>
              <p>depositAmount: {this.state.depositAmount}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
