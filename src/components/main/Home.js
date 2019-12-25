//pic size 687*687
import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Auth from '../../lib/Auth'
import Chart from 'chart.js'
import Ticker from 'react-ticker'
import {Spring, config} from 'react-spring/renderprops'


let  dataValues =[0]
let  dataNames =[]
let dataColors =[]
let  myChart
let total
let thing
let user = Auth.getPayload()
//console.log(user)
const direction = ['toLeft', 'toRight']
class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: {},
      error: '',
      coins: {},
      user: { total: 0
      },
      wallet: {}

    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.buy = this.buy.bind(this)
    this.sell = this.sell.bind(this)

  }
  dynamicColors() {
    var r = Math.floor(Math.random() * 255)
    var g = Math.floor(Math.random() * 255)
    var b = Math.floor(Math.random() * 255)
    var a = 0.2
    return 'rgba(' + r + ',' + g + ',' + b +','+a+ ')'
  }

  componentDidMount(){

    if(this.props.history.location.state){
      console.log(this.props.history.location.state.detail[0].sub)
      thing = this.props.history.location.state.detail[0]
    }
    if(Auth.isAuthenticated()&& user ){
      //console.log(user)
      axios.get(`/api/users/${user.sub}`)
        .then(res => this.setState({user: res.data}))
      axios.get(`/api/wallets/${user.sub}`)
        .then(res => this.setState({wallet: res.data}))
    }

    if(Auth.isAuthenticated()&& this.props.history.location.state ){
      console.log(thing.sub)
      axios.get(`/api/users/${thing.sub}`)
        .then(res => this.setState({user: res.data}))
      axios.get(`/api/wallets/${thing.sub}`)
        .then(res => this.setState({wallet: res.data}))
    }


  }

  componentDidUpdate(prevProps){
    user = Auth.getPayload()
    if(this.state.wallet.dollars>=0 && user){
      delete this.state.wallet.id
      axios.put(`/api/wallets/${user.sub}`, this.state.wallet)
      console.log('udpdate')
    }
    if (prevProps !== this.props) {
      this.setState({coins: this.props.coins.data})
      //console.log(this.state)
    }
    var ctx = document.getElementById('myChart')
    if(myChart){
      myChart.destroy()
      //console.log(myChart)
    }
    if(Auth.isAuthenticated()){
      myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: dataNames,
          datasets: [{
            label: '# of Votes',
            data: dataValues,
            backgroundColor: dataColors,
            borderColor: dataColors.map(x=> x = x.replace(/0.2/g, '1')),
            borderWidth: 1
          }]
        },
        options: {

          tooltips: {
            enabled: true
          },

          responsive: true,
          legend: {
            labels: {
              // This more specific font property overrides the global property
              fontSize: 24
            }
          }
        }
      })

    }
  }

  buy(e){
  //  console.log('hiya '+e.target.id)

    const value = document.getElementById(e.target.id+'Value')
    if(this.state.wallet.dollars>= parseFloat(value.value)){
      this.setState({wallet: {
        ...this.state.wallet,
        [e.target.id]: this.state.wallet[e.target.id] +(parseFloat(value.value)/parseFloat(value.getAttribute('data-key'))),
        dollars: this.state.wallet.dollars -(parseFloat(value.value))}
      })

      delete this.state.wallet.id
      axios.put(`/api/wallets/${user.sub}`, this.state.wallet)
      console.log(this.state.wallet)
      console.log('buy')
      this.update()
    }

  }

  sell(e){
  //  console.log('hiya '+e.target.id)
    const value = document.getElementById(e.target.id+'Value')
    if(this.state.wallet[e.target.id]-(parseFloat(value.value)/parseFloat(value.getAttribute('data-key')))>=0 ){
      this.setState({wallet: {
        ...this.state.wallet,
        [e.target.id]: this.state.wallet[e.target.id] -(parseFloat(value.value)/parseFloat(value.getAttribute('data-key'))),
        dollars: this.state.wallet.dollars+parseFloat(value.value)}
      })
      delete this.state.wallet.id
      axios.put(`/api/wallets/${user.sub}`, this.state.wallet)
      console.log(this.state.wallet)
      console.log('sell')
      this.update()
    }

  }

  update(){
    delete this.state.wallet.id
    axios.put(`/api/wallets/${user.sub}`, this.state.wallet)
    console.log(this.state)
  }
  render() {

    total = Object.values(dataValues).reduce((t, n) => t + n)
    //console.log(this.state)
    if(dataColors.length>dataValues.length){
      dataColors = []
    }
    dataValues=[this.state.wallet.dollars]
    dataNames=['Dollars']

    //console.log(this.state)
    let values  = Object.entries(this.state.wallet)
    values = values.map(x=>{
      return(
        [ x[0].replace(/_/g, '-'),x[1]])
    })


    return (
      <div className='container'>

        {!Auth.isAuthenticated() &&
            <div >
              Trade Crypto
            </div>
        }


        {Auth.isAuthenticated() &&this.props.coins && this.state.wallet && this.props.coins.data.map(x=>  {
          return(

            <Ticker key={x.id} className='ticker' speed={Math.floor(Math.random()*6)+2} direction={direction[Math.floor(Math.random()*2)]}>
              {({ index }) => (
                <>

            <div key={x.id}>
              {' '+ x.name +'  ' } : {x.priceUsd +' --   '  }
            </div>
            </>
              )}

            </Ticker>)
        })
        }
        {Auth.isAuthenticated() && <div>
          <hr/>
          <div>Portfolio </div>
          <div className='columns'>
            <div className='column is-half'>
              <canvas id="myChart" width="600" height="600"></canvas>
            </div>
            <div className='column stats'>
              <p>Portfolio Current Value: $ {total}</p>
              <p>Current Cash To Spend:$ {this.state.wallet.dollars}</p>
            </div>
          </div>

          <div className="portfolio tile is-ancestor">
            {values && this.props.coins && values.map(x=>{
              return(
                this.props.coins.data.map(a=> {
                  if(x[0]===a.id){

                    dataValues.push(a.priceUsd * x[1])
                    total = Object.values(dataValues).reduce((t, n) => t + n)

                    dataNames.push(a.name)
                    if(dataColors.length<dataNames.length){
                      dataColors.push(this.dynamicColors())
                    }
                    return(
                      <div key={x[0]} className="tile is-3 is-parent box">


                        <div className="tile is-child box" >

                          <div key={a.id}>
                            <p className="title">{a.name}</p>
                            <p>Current Coin Value :</p><p>${parseFloat(a.priceUsd).toFixed(7)}</p>
                            <p>You hold:</p>    <Spring
                              config={config.molasses}
                              from={{ number: 0 }}
                              to={{ number: parseFloat(a.priceUsd).toFixed(7)*x[1]} }>
                              {props => <div>${props.number}</div>}
                            </Spring>
                          </div>

                          $<input placeholder="$" key={a.priceUsd} data-key={a.priceUsd} type="number" defaultValue={0} id={a.id.replace(/-/g, '_')+'Value'}
                          /><div>
                            <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.buy}> buy</div> <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.sell}> sell</div>
                          </div>


                        </div>


                      </div>
                    )
                  }
                }
                ))
            })}



          </div>

        </div>}
      </div>



    )
  }
}
export default Home
