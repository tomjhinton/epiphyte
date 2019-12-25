import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


class Footer extends React.Component{
  constructor(){
    super()
    this.state = {
      data: {},
      error: ''

    }
    this.componentDidMount = this.componentDidMount.bind(this)
  }


  componentDidMount(){



  }

  render() {



    return (

      <div className='footer'>
      “Gold is the corpse of value...”
      ― Neal Stephenson, Cryptonomicon
      </div>




    )
  }
}
export default Footer
