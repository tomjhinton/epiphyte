//pic size 687*687
import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Auth from '../../lib/Auth'



const user = Auth.getPayload()
//console.log(user)

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: {},
      error: '',
      coins: {},
      user: ''

    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.buy = this.buy.bind(this)
    this.sell = this.sell.bind(this)

  }


  componentDidMount(){
    axios.get(`/api/users/${user.sub}`)
      .then(res => this.setState({user: res.data}))

  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props) {
      this.setState({coins: this.props.coins.data})
      console.log(this.state)
    }
  }

  buy(e){
    console.log('hiya '+e.target.id)
    this.setState({user: {
      ...this.state.user,
      [e.target.id]: this.state.user[e.target.id] +1}
    })
  }

  sell(e){
    console.log('hiya '+e.target.id)
    this.setState({user: {
      ...this.state.user,
      [e.target.id]: this.state.user[e.target.id] -1}
    })
  }


  render() {
    console.log(this.state)
    let values  = Object.entries(this.state.user)
    values = values.map(x=>{
      return(
        [ x[0].replace(/_/g, '-'),x[1]])
    })

    console.log(values)

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
              {x.id} : {x.priceUsd * 1}
            </div>)
        })
        }
        <hr/>
        {values && this.props.coins && values.map(x=>{
          return(
            <div key={x[0]}>
              {this.props.coins.data.map(a=> { if(x[0]===a.id){
                return(
                  <div>
                  <span key={a.id}>
                    {a.name} : {a.priceUsd * x[1]}
                  </span> <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.buy}> buy</div> <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.sell}> sell</div>
                </div>)
              }
              })}

            </div>
          )
        })}




      </div>




    )
  }
}
export default Home
