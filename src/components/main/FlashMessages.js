import React from 'react'
import Flash from '../../lib/Flash'
import { withRouter } from 'react-router-dom'

class FlashMessages extends React.Component {
  constructor() {
    super()
    // set the messages in state to be null to begin with
    this.state = { messages: null }
  }

  componentDidUpdate() {
    // when the component updates (ie, we change route)
    // get the messages from the Flash store
    const messages = Flash.getMessages()
    // if there are no messages, there's nothing to do...
    if(!messages) return false
    // otherwise set them onto state, so we can display them to the user
    this.setState({ messages })
    // clear the messages out of the store, so we don't display them again
    Flash.clearMessages()
    // after 2.5 secs, remove the message
    setTimeout(() => this.setState({ messages: null }), 3500)
  }

  render() {
    // if there are no message, don't display anything
    // otherwise loop through the messages object, and display each message...
    return (
      <div>
        {this.state.messages && Object.keys(this.state.messages).map(type =>
          <div key={type} >
            <div className='container flash-message' >
              <div>{this.state.messages[type]}</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(FlashMessages)
