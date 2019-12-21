
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import 'bulma'
import './style.scss'
import axios from 'axios'

import Home from './components/main/Home'
import Header from './components/main/Header'
import Footer from './components/main/Footer'
import Login from './components/user/Login'
import Register from './components/user/Register'

const coinsArr = ['bitcoin','ethereum','ripple','tether','bitcoin-cash','litecoin','eos','binance-coin','bitcoin-sv','cosmos','tezos','stellar','cardano','tron','unus-sed-leo','monero','huobi-token','chainlink','neo','maker']

class App extends React.Component {
  constructor(){
    super()

    this.state = {
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateCoins = this.updateCoins.bind(this)

  }

  updateCoins(){
    axios.get('https://api.coincap.io/v2/assets')
      .then(res => {
        console.log(res)
        res.data.data = res.data.data.filter(x=> {
          return coinsArr.includes(x.id)
        })
        this.setState({ coins: res.data })
        console.log(this.state)
      })
  }


  componentDidMount() {
    axios.get('https://api.coincap.io/v2/assets')
      .then(res => {
        console.log(res)
        res.data.data = res.data.data.filter(x=> {
          return coinsArr.includes(x.id)
        })
        this.setState({ coins: res.data })
      })

      this.interval = setInterval(() => {
        this.updateCoins();
      }, 100000);
  }



  render() {
    return (

      <Router>
        <main>
          <Header />
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/"
              render={(state) => <Home {...state} coins={this.state.coins} />} />

          </Switch>

        </main>
        <footer>
          <Footer/>
        </footer>
      </Router>


    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
