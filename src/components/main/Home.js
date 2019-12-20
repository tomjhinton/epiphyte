//pic size 687*687
import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Auth from '../../lib/Auth'

const coinsArr = ['bitcoin',
'ethereum'
,'ripple'
,'tether'
,'bitcoin-cash'
,'litecoin'
,'eos'
,'binance-coin'
,'bitcoin-sv'
,'cosmos'
,'tezos'
,'stellar'
,'cardano'
,'tron'
,'unus-sed-leo'
,'monero'
,'huobi-token'
,'chainlink'
,'neo'
,'maker']

const user = Auth.getPayload()
//console.log(user)

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: {},
      error: '',
      coins: this.props.coins,
      user: ''

    }
    this.componentDidMount = this.componentDidMount.bind(this)

  }


  componentDidMount(){
    axios.get(`/api/users/${user.sub}`)
      .then(res => this.setState({user: res.data}))
    console.log(this.state)

  }

  render() {

    // console.log(this.props.coins)
     console.log(Object.entries(this.state.user))

    return (
      <div className='container'>

        {!Auth.isAuthenticated() &&this.props.coins && this.props.coins.data.map(x=>  {
          return(
            <div key={x.id}>
            {x.name} : {x.priceUsd}
            </div>)
        })}
        {Auth.isAuthenticated() &&this.props.coins && this.state.user && this.props.coins.data.map(x=>  {
          return(
            <div key={x.id}>
            {x.name} : {x.priceUsd * 1}
            </div>)
        })
      }




      </div>




    )
  }
}
export default Home
