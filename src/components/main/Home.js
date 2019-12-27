//pic size 687*687
import React from 'react'
import axios from 'axios'
import Auth from '../../lib/Auth'
import Chart from 'chart.js'
import Ticker from 'react-ticker'
import {Spring, config} from 'react-spring/renderprops'


let  dataValues =[0]
let  dataNames =[]
let dataColors =[]
let  myChart
let histChart
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
    this.history = this.history.bind(this)
    this.toggleActive = this.toggleActive.bind(this)

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

    }
    var ctx = document.getElementById('myChart')
    if(myChart){
      myChart.destroy()

    }
    if(Auth.isAuthenticated()){
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dataNames,
          datasets: [{

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
      console.log(myChart)
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

  toggleActive(e){
    console.log(e.target.parentNode)
    e.target.parentNode.classList.remove('is-active')

  }

  history(e){
    var modal =  document.getElementById(e.target.id+'Modal')
    modal.classList.add('is-active')
    e.persist()
    console.log()
    const name = e.target.id
    console.log(name)
    var canvas = document.getElementById(e.target.id+'Chart')
    var ctx = canvas.getContext('2d')
    ctx.font = '40px Helvetica'
    ctx.fillText('Loading Coin Data ...', 10, 50)

    if(histChart){
      histChart.destroy()
      //console.log(histChart)
    }
    axios.get(`https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/${e.target.id}/history?interval=d1
`)
      .then(res => {

        console.log(res.data)

        histChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: res.data.data.map(x=> x = x.date.split('T')[0]),
            datasets: [{
              label: name,
              data: res.data.data.map(x=> x = parseFloat(x.priceUsd)),
              backgroundColor: res.data.data.map(x => x = this.dynamicColors()),
              borderColor: dataColors.map(x=> x = x.replace(/0.2/g, '1')),
              borderWidth: 1
            }]

          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                    return '$' + value
                  }
                }
              }]
            },
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




      })


  }

  render() {

    if(this.props.coins &&this.state.user){

      total = this.state.wallet.dollars
      let wal = Object.entries(this.state.wallet)
      const coins =  Object.entries(this.props.coins.data)
      wal = wal.map(x=>{
        console.log(x)
        return(
          [ x[0].replace(/_/g, '-'),x[1]])
      })
      for(let i=0;i<wal.length;i++){
        for(let j=0;j<coins.length;j++){
          if(wal[i][0] === coins[j][1].id)
            total+= (wal[i][1] * coins[j][1].priceUsd)
        }
      }
    }


    if(dataColors.length>dataValues.length){
      dataColors = []
    }
    dataValues=[this.state.wallet.dollars]
    dataNames=['Dollars']

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
          <div className='portTitle'>Portfolio </div>
          <div className='columns'>
            <div className='column is-half'>
              <canvas id="myChart" width="600" height="600"></canvas>
            </div>
            <div className='column stats'>
              <p>Portfolio Value:
                <Spring
                  config={config.molasses}
                  from={{ number: 0 }}
                  to={{ number: total} }>
                  {props => <span> ${props.number}</span>}
                </Spring></p>
              <p>Current Cash To Spend: ${parseFloat(this.state.wallet.dollars).toFixed(2)}</p>
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
                            <p className="title history" id={a.id} onClick={this.history}>{a.name}</p>
                            <p>Current Coin Value :</p><p>${parseFloat(a.priceUsd).toFixed(7)}</p>
                            <p>You hold:</p>
                            <Spring
                              config={config.molasses}
                              from={{ number: 0 }}
                              to={{ number: parseFloat(a.priceUsd).toFixed(7)*x[1]} }>
                              {props => <div>${props.number}</div>}
                            </Spring>
                          </div>

                          $<input className="inputBS" placeholder="$" key={a.priceUsd} data-key={a.priceUsd} type="number" defaultValue={0} id={a.id.replace(/-/g, '_')+'Value'}
                          /><div>
                            <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.buy}> buy</div> <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.sell}> sell</div>
                          </div>
                          <div className="modal" id={a.id+'Modal'}>
                            <div className="modal-background"></div>
                            <div className="modal-content">
                              <div>Historical Coin Value </div>
                              <canvas height={500} width ={500} id={a.id+'Chart'}> </canvas>
                            </div>
                            <button className="modal-close is-large" onClick={this.toggleActive} aria-label="close"></button>
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
