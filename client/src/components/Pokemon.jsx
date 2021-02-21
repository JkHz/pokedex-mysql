import React from 'react';
import axios from 'axios';

export default class Pokemon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: '',
      updateSelected: false,
    }

    this.updateName = this.updateName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.editMode = this.editMode.bind(this);
    this.deletePoke = this.deletePoke.bind(this);
  }

  editMode() {
    if (this.state.updateSelected) {
      return (
        <div>
          <input name="newName" onChange={this.handleChange}></input>
          <div>
            <button onClick={this.updateName}>Change Name</button>
            <button onClick={this.toggleUpdate}>Cancel</button>
            <button onClick={this.deletePoke}>Delete Pokemon</button>
          </div>
        </div>
      )
    }
  }

  updateName() {
    axios.put(`/api/updateName/${this.props.poke.id}`, {
      "name": this.state.newName
    })
      .then(() => {
        this.toggleUpdate();
      })
      .then(() => {
        this.props.getPokemon();
      })
      .catch((err) => {
        console.error(err)
      })
  }

  deletePoke() {
    axios.delete(`/api/deletePokemon/${this.props.poke.id}`)
      .then(() => {
        this.toggleUpdate();
      })
      .then(() => {
        this.props.getPokemon();
      })
      .then(() => {
        this.props.getTypes();
      })
      .catch((err) => {
        console.error(err)
      })
  }

  handleChange(e) {
    this.setState({
      newName: e.target.value
    })
  }

  toggleUpdate() {
    this.setState({
      updateSelected: !this.state.updateSelected
    })
  }

  render() {
    return (
      <div>
        <h3>{this.props.poke.name}</h3>
        {this.editMode()}
        {!this.state.updateSelected ? <button onClick={this.toggleUpdate}>Edit</button> : null}
        <div>
          <img src={this.props.poke.img} />
          <p>Type: {this.props.poke.type}</p>
        </div>
      </div>
    )
  }
}