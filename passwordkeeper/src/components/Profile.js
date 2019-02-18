import React, { Component } from 'react';
import { fire } from '../config/Fire';
import { Form, Button, Collapse } from 'react-bootstrap';
 
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      account: [],
      username: [],
      password: [],
      users: '',
      openNuovo: false,
      openSalvato: false
    }
  }

  writeUserData(userID, email,fname,lname){
    fire.database().ref('users/' + userID).set({
        email,
        fname,
        lname
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
  }

  readUserData(userID) {
    const rootRef = fire.database().ref();
    const user = rootRef.child('users/'+userID)

    user.once('value', snap => {
      snap.forEach(child => {
        this.setState({
          account: this.state.account.concat([child.key]),
          username: this.state.username.concat([child.val().username]),
          password: this.state.password.concat([child.val().password])
        });
        console.log(child.key + '' + child.val().username + '' + child.val().passowrd)
        const userList = this.state.account.map((dataList, index) =>
                <p>
                    {dataList}
                    <br />
                    {this.state.username[index]}
                    <br />
                    {this.state.password[index]}
                    <hr />
                </p>
            );
            this.setState({
                users: userList
            });
      })
    })

  }

  updateSingleData(email){
    fire.database().ref('users/').update({
        email,
    });
  }

  aggiungiDati(event) {
    event.preventDefault()  //quando si clicca non cambia pagina e la ricarica
    
    const accountNuovo = this.accountInput.value
    const usernameNuovo = this.accountInput.value
    const passwordNuovo = this.passwordInput.value

    this.accountForm.reset();

    this.writeUserData(this.props.userID, accountNuovo, usernameNuovo, passwordNuovo)
    //this.readUserData(this.props.userID)
  }

  componentWillMount() {
    this.readUserData(this.props.userID)
  }

  componentWillUnmount() {
    /* cancellare dati utente */
  }

  render() {
    const { openNuovo, openSalvato } = this.state;
    return (
     <div className="welcomeText">
         <h1>Pagina personale di {this.props.name}</h1>
         
        <Button variant='dark'
          onClick={() => this.setState({ openNuovo: !openNuovo })}
          aria-controls="collapse-account-nuovo"
          aria-expanded={openNuovo}>
          Aggiungi account
        </Button>
        <Collapse in={this.state.openNuovo}>
        <div className="nuovoAccountStyle" id="collapse-account-nuovo">
          <Form onSubmit={(event) => { this.aggiungiDati(event) }} ref={(form) => { this.accountForm = form }}>
          <Form.Group controlId="formBasicInput">
              <Form.Label>Account</Form.Label>
              <Form.Control type="text" placeholder="Enter account" ref={(input) => { this.accountInput = input }}/>
              <Form.Text className="text-muted">
                Ex: Facebook, Twitter..
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicInput">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" ref={(input) => { this.usernameInput = input }}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={(input) => { this.passwordInput = input }}/>
            </Form.Group>
            <Button variant="dark" type="submit">
              Salva
            </Button>
          </Form>
        </div>
        </Collapse>      
        <br />
        <br />
        <Button variant='dark'
        onClick={() => this.setState({ openSalvato: !openSalvato })}
        aria-controls="collapse-account-salvati"
        aria-expanded={openSalvato}>
        Account Salvati
        </Button>
        <Collapse in={this.state.openSalvato}>
          <div id="collapse-account-salvati">
          <ul>{this.state.users}</ul>
          </div>
        </Collapse>


        {/* <table>
          <tr>
                  <td colspan="2" align="center"><b>Impostazioni</b></td>
              </tr>
              <tr><td><b>Nome</b></td><td><input type="text" name="nome"/></td></tr>
              <tr><td><b>Cognome</b></td><td><input type="text" name="cognome"/></td></tr>
              <tr><td><b>Password</b></td><td><input type="password" name="password"/></td></tr>
              <tr><td colspan="2" align="right"><input type="button" value="Invia" onClick="Modulo()"/></td></tr>
          
        </table> */}

        </div>
    );
  }
}

export default Profile;
