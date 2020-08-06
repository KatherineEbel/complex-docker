import React, { Component } from 'react'
import axios from 'axios'
import './Fib.css'

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  }
  
  async update() {
    await this.fetchValues()
    await this.fetchIndexes()
  }
  
  async componentDidMount() {
    await this.update()
  }
  
  async fetchValues() {
    const { data } = await axios.get(`/api/values/current`)
    this.setState({ values: data })
  }
  
  async fetchIndexes() {
    const { data } = await axios.get(`/api/values/all`)
    this.setState({ seenIndexes: data })
  }
  
  handleSubmit = async (event) => {
    const { index } = this.state
    event.preventDefault()
    await axios.post(`/api/values`, { index })
    this.setState({ index: `` })
    await this.update()
  }
  
  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(`, `)
  }
  
  renderValues() {
    return Object.entries(this.state.values).map(([key, value]) => {
      return <div key={key}>
        <p>I calculated { value } for index { key }</p>
      </div>
    })
  }
  
  render() {
    const { index } = this.state
    return (
      <div className="Fib">
        <form onSubmit={ this.handleSubmit }>
          <label>Enter your index:</label>
          <input type="text"
                 value={ index }
                 onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I have seen:</h3>
        { this.renderSeenIndexes() }
        <h3>Calculated Values:</h3>
        { this.renderValues() }
      </div>
    )
  }
}

export default Fib
