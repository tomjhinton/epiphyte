//pic size 687*687
import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Auth from '../../lib/Auth'




const user = Auth.getPayload()
//console.log(user)

class LeaderBoard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: {},
      error: '',
      coins: {}


    }
    this.componentDidMount = this.componentDidMount.bind(this)


  }

  componentDidMount(){

    axios.get('/api/users')
      .then(res => this.setState({users: res.data}))
      axios.get('/api/wallets')
        .then(res => this.setState({wallets: res.data}))




  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props && Auth.isAuthenticated()) {
      this.setState({coins: this.props.coins.data})
      //console.log(this.state)
    }
  }





  render() {

    console.log(this.state)

    return (
      <div className='container'>

        {this.state.wallets && this.props.coins&&   this.state.users && this.state.wallets.map(x=>  {
          return(
            this.state.users.map(a=>{
              if(a.id === x.id){

                let total = x.dollars
                let wal = Object.entries(x)
                const coins=  Object.entries(this.props.coins.data)
                wal  = wal.map(x=>{
                  return(
                    [ x[0].replace(/_/g, '-'),x[1]])
                })
                for(let i=0;i<wal.length;i++){
                  for(let j=0;j<coins.length;j++){
                    if(wal[i][0] === coins[j][1].id)
                      total+= (wal[i][1] * coins[j][1].priceUsd)
                  }
                }
                return(

                  <div key={a.id}>
                    {a.username}:
                    <p>$:{total}</p>
                  </div>

                )
              }


            })

          )}
        )}







      </div>






    )
  }
}
export default LeaderBoard
