
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import 'bulma'
import './style.scss'
import axios from 'axios'

import Home from './components/main/Home'
import Header from './components/main/Header'
import Footer from './components/main/Footer'


class App extends React.Component {
  constructor(){
    super()

    this.state = {
    }
  }

  componentDidMount() {
    axios.get('https://api.coincap.io/v2/assets')
      .then(res => this.setState({ coins: res.data }))
  }

  render() {
    return (

      <Router>
        <main>
          <Header />
          <Switch>
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
