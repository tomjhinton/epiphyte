//pic size 687*687
import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Auth from '../../lib/Auth'
import Chart from 'chart.js'
import Ticker from 'react-ticker'


let  dataValues
let  dataNames
let dataColors
let  myChart
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
   dynamicColors() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            var a = 0.2;
            return "rgba(" + r + "," + g + "," + b +","+a+ ")";
         };

  componentDidMount(){
    if(Auth.isAuthenticated()){
    axios.get(`/api/users/${user.sub}`)
      .then(res => this.setState({user: res.data}))
    }


  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props) {
      this.setState({coins: this.props.coins.data})
      console.log(this.state)
    }
    var ctx = document.getElementById('myChart');
    if(myChart){
      myChart.destroy()
      console.log(myChart)
    }
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
});

  }

  buy(e){
    console.log('hiya '+e.target.id)

    const value = document.getElementById(e.target.id+'Value')
    if(this.state.user.dollars> parseFloat(value.value)){
    this.setState({user: {
      ...this.state.user,
      [e.target.id]: this.state.user[e.target.id] +(parseFloat(value.value)/parseFloat(value.getAttribute('data-key'))),
      dollars: this.state.user.dollars -(parseFloat(value.value))}
    })
  }

  }

  sell(e){
    console.log('hiya '+e.target.id)
    const value = document.getElementById(e.target.id+'Value')
    if(this.state.user[e.target.id]-(parseFloat(value.value)/parseFloat(value.getAttribute('data-key')))>0 ){
    this.setState({user: {
      ...this.state.user,
      [e.target.id]: this.state.user[e.target.id] -(parseFloat(value.value)/parseFloat(value.getAttribute('data-key'))),
      dollars: this.state.user.dollars+parseFloat(value.value)}
    })
  }
  }


  render() {
    dataValues=[]
    dataNames=[]
    dataColors = []
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
        {this.props.coins &&<Ticker  mode='smooth'>
        {({ index }) => (
            <>
            {index}

        {Auth.isAuthenticated() &&this.props.coins && this.state.user && this.props.coins.data.map(x=>  {
          return(
            <div key={x.id}>
              {x.id} : {x.priceUsd}
            </div>)
        })
        }
        </>
      )}

        </Ticker>}
        <hr/>
        <div>Portfolio </div>
        <canvas id="myChart" width="600" height="600"></canvas>

        <div className="portfolio columns is-multiline">
        <div className="column is-half">Dollars: {this.state.user.dollars}</div>
        {values && this.props.coins && values.map(x=>{
          return(
            <div key={x[0]} className="column is-one-third">
              {this.props.coins.data.map(a=> { if(x[0]===a.id){
                dataValues.push(a.priceUsd * x[1])
                dataNames.push(a.name)
                dataColors.push(this.dynamicColors())
                return(
                  <div >
                  <div>
                    <span key={a.id}>
                      {a.name} :$ {a.priceUsd * x[1]}
                    </span>
                    <input key={a.priceUsd} data-key={a.priceUsd} type="number" defaultValue={0} id={a.id.replace(/-/g, '_')+'Value'}
                    />
                    <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.buy}> buy</div> <div id={a.id.replace(/-/g, '_')} className='button' onClick={this.sell}> sell</div>

                  </div>
                  </div>
                )
              }
              })}


            </div>
          )
        })}


        </div>

      </div>




    )
  }
}
export default Home
