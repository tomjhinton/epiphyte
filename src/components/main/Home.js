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


class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: {},
      error: '',
      coins: this.props.coins

    }
    this.componentDidMount = this.componentDidMount.bind(this)
  }


  componentDidMount(){
    // axios.get('/api/records')
    //   .then(res => this.setState({ records: res.data }))


  }

  render() {

    // console.log(this.props.coins)
    // console.log(this.state)

    return (
      <div className='container'>

      {!Auth.isAuthenticated() &&this.props.coins && this.props.coins.data.map(x=>  {
        return(
        <div key={x.id}>
        {x.name} : {x.priceUsd}
        </div>)
      })}


      </div>




    )
  }
}
export default Home
