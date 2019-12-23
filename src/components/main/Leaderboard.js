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

  componentDidUpdate(){

  }





  render() {

    console.log(this.state)

    return (
      <div className='container'>

        {this.state.wallets && this.state.wallets.map(x=>  {
            return(
          this.state.users.map(a=>{
            return(

              <div key={a.id}>
                {x.id} {a.id}
              </div>
            )


          })

        )}
      )}







        </div>






    )
  }
}
export default LeaderBoard
