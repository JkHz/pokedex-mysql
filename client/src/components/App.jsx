import React from 'react';
import axios from 'axios';
import Pokemon from './Pokemon';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      types: [],
      typeSelected: '',
      insertClicked: false,
      insertName: '',
      insertType: '',
      insertImg: '',
    }
    this.getPokemon = this.getPokemon.bind(this);
    this.getTypes = this.getTypes.bind(this);
    this.filterPokemon = this.filterPokemon.bind(this);
    this.selectType = this.selectType.bind(this);
    this.toggleInsert = this.toggleInsert.bind(this);
    this.insertMode = this.insertMode.bind(this);
    this.insertPoke = this.insertPoke.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
  }

  componentDidMount() {
    this.getTypes();
    this.getPokemon();
  }

  getTypes() {
    axios.get(`/api/allTypes`)
      .then(({ data }) => {
        this.setState({ types: data })
      })
      .catch((err) => console.error(err))
  }

  getPokemon() {
    axios.get(`/api/allPokemon`)
      .then(({ data }) => {
        this.setState({ pokemon: data })
      })
      .catch((err) => console.error(err))
  }

  filterPokemon() {
    axios.post(`/api/filteredPokemon`, {
      type: this.state.typeSelected
    })
      .then(({ data }) => {
        this.setState({ pokemon: data })
      })
      .catch((err) => console.error(err))
  }

  selectType(e) {
    if (e.target.value === "sort") {
      this.getPokemon();
    } else {
      this.setState({ typeSelected: e.target.value },
        () => this.filterPokemon())
    }
  }

  toggleInsert() {
    this.setState({
      insertClicked: !this.state.insertClicked
    })
  }

  insertMode() {
    if (this.state.insertClicked) {
      return (
        <div>
          <input name="insertName" placeholder="Pokemon Name" onChange={this.handleInsert}></input>
          <input name="insertType" placeholder="Pokemon Type" onChange={this.handleInsert}></input>
          <input name="insertImg" placeholder="Pokemon Image" onChange={this.handleInsert}></input>
          <button onClick={this.insertPoke}>Insert Pokemon</button>
          <button onClick={this.toggleInsert}>Cancel</button>
        </div>
      )
    }
  }

  handleInsert(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  insertPoke() {
    axios.post(`/api/insertPokemon`, {
      "name": this.state.insertName,
      "type": this.state.insertType,
      "img": this.state.insertImg
    })
      .then(() => {
        this.toggleInsert();
      })
      .then(() => {
        this.getPokemon();
      })
      .then(() => {
        this.getTypes();
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render() {
    return (
      <div>
        <h1>Fullstack Pokedex!</h1>
        <button onClick={this.getPokemon}>Show All Pokemon!</button>
        <select id="types" onChange={this.selectType}>
          <option value="sort">Sort By Type</option>
          {this.state.types.map((typeObj, index) => (
            <option key={index}>{typeObj.type}</option>
          ))}
        </select>
        <button onClick={this.toggleInsert}>Add New Pokemon!</button>
        {this.insertMode()}
        {this.state.pokemon.map((poke, index) => (
          <Pokemon poke={poke}
                   getPokemon={this.getPokemon}
                   getTypes={this.getTypes}
                   key={index} />
        ))}
      </div>
    )
  }
};