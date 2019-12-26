import React from 'react'
import axios from 'axios'

class Register extends React.Component{
  constructor(){
    super()
    this.state ={
      data: {},
      errors: {},
      coins: {
        dollars: 100.0,
        bitcoin: 0.0,
        ethereum: 0.0,
        ripple: 0.0,
        tether: 0.0,
        bitcoin_cash: 0.0,
        litecoin: 0.0,
        eos: 0.0,
        binance_coin: 0.0,
        bitcoin_sv: 0.0,
        cosmos: 0.0,
        tezos: 0.0,
        stellar: 0.0,
        cardano: 0.0,
        tron: 0.0,
        unus_sed_leo: 0.0,
        monero: 0.0,
        huobi_token: 0.0,
        chainlink: 0.0,
        neo: 0.0,
        maker: 0.0
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleChange(e) {
    // merge data on state with new data from the form
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    // set the data back on state

    this.setState({  data })
  }

  handleSubmit(e) {
    this.setState({ errors: '' })
    e.preventDefault()
    console.log(this.state.data)
    axios.post('/api/register', this.state.data)
      // redirect the user to the login page...
      .catch(err => {
        console.log(err)
        this.setState({ errors: err.response.data.error })
      })
      .then( e=>{
        if(!this.state.errors){

          axios.post('/api/wallets', this.state.coins)
            .then(() => this.props.history.push('/login')) // redirect the user to the login page...
            .catch(err => this.setState({ errors: err.response.data.errors }))
        }
      }
      )
  }

  render(){

    return(

      <div className='container'>
        <div className="title section form-title">Register</div>
        <div className="user-form">
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  name="username"
                  placeholder="eg: drakeon"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.username && <div className="help is-danger">{this.state.errors.username}</div>}
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input   className="input"    name="email"
                  placeholder="eg: jack@hotmail.com"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.email && <div className="help is-danger">{this.state.errors.email}</div>}
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className="input"
                  name="password"
                  type="password"
                  placeholder="eg: ••••••••"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.password && <div className="help is-danger">{this.state.errors.password}</div>}
            </div>
            <div className="field">
              <label className="label">Password Confirmation</label>
              <div className="control">
                <input
                  className="input"
                  name="password_confirmation"
                  type="password"
                  placeholder="eg: ••••••••"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.errors.passwordConfirmation && <div className="help is-danger">{this.state.errors.passwordConfirmation}</div>}
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
export default Register
