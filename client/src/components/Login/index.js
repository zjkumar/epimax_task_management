



import {Component} from 'react'
import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import withRouter from '../withRouter'



import './index.css'


const localhost = 'http://localhost:5000'
const globalhost = 'https://epimax-task-management-backend.onrender.com'

const currentHost = globalhost

class Login extends Component {
  state = {newUser: false, username: '',fullname: '', showJoiningError: false, showLoginError: false, loginErrorMsg: '', joinErrorMsg: ''}
  
  onChangeFullname = event => this.setState({fullname: event.target.value})

  onChangeUsername = event => this.setState({username: event.target.value})
  

  onLoginSuccess = (jwtToken, username) => {

    const { navigate } = this.props;
    Cookies.set('jwt_token', jwtToken)
    Cookies.set('username', username)
    navigate("/")
  
  }

  onLoginFailure = errMsg => this.setState({showLoginError: true, loginErrorMsg: errMsg})

  onJoinSuccess = (jwtToken, username) => {
    
    const { navigate } = this.props;
    Cookies.set('jwt_token', jwtToken)
    Cookies.set('username', username)
    navigate("/")
  
  }
// 
  onJoinFailure = errMsg => this.setState({showJoiningError: true, joinErrorMsg: errMsg})

  login = async () => {
    const {username} = this.state
    console.log(username, 'this is username')
    const userDetails = {username}
    if ( username === ''){
        this.setState({showLoginError: true})
        return
    }

    let apiUrl = currentHost + '/login'

    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      // timeout: 60000,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    
    // console.log(data)
   
    if (response.ok === true) {
      const data = await response.json()
      this.onLoginSuccess(data.jwt_token, data.username)
    } else {
      const data = await response.json()
      this.onLoginFailure(data.error)
    }
  }

  join = async () => {
        const {fullname, username} = this.state

        if (fullname === '' || username === ''){
            this.setState({showJoiningError: true})
            return
        }

        let details = {
            fullname, username
        }

        let url = currentHost + '/create-user'

        const options = {
            method: 'POST',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(details)
        }
        const response = await fetch(url, options)
        // console.log(response, 'this is response')
        const data = await response.json()
        console.log(data)

        if (response.ok === true) {
            this.onJoinSuccess(data.token, data.username)
          } else {
            this.onJoinFailure(data.error)
          }

  }

  wantsToLogin = () => this.setState({newUser: false, username: '',fullname: '', showJoiningError: false, showLoginError: false, loginErrorMsg: '', joinErrorMsg: ''})

  wantsToJoin = () => this.setState({newUser: true, username: '',fullname: '', showJoiningError: false, showLoginError: false, loginErrorMsg: '', joinErrorMsg: ''})

  

  render() {
    const {newUser, username, fullname, showJoiningError,showLoginError, loginErrorMsg, joinErrorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Navigate to="/" />
    }
    return (
      newUser ? 
      (
        <div className="login-container">
        <div className="form-container">
          <img
            src="https://res.cloudinary.com/n0ta10sear/image/upload/v1714538319/epimax_task_management_logo_dpv4zl.png"
            className="login-website-logo"
            alt="website logo"
          />
          <div className="input-container">
            <label className='input-label' htmlFor='fullname'>
                FULLNAME
            </label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              className="username-input-field"
              onChange={this.onChangeFullname}
              placeholder="Fullname"
            />

            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="username-input-field"
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>
          
          <button type="button" onClick={this.join} className="login-button">
            Join
          </button>

          <p className="input-label">Want to Login ?</p>
          <button type="button" onClick={this.wantsToLogin} className="want-to-login">
            Existing User / Login
          </button>
          {showJoiningError && <p className="error-message">*{joinErrorMsg}</p>}
        </div>
      </div>
      )
      : (
        <div className="login-container">
        <div className="form-container">
          <img
            src="https://res.cloudinary.com/n0ta10sear/image/upload/v1714538319/epimax_task_management_logo_dpv4zl.png"
            className="login-website-logo"
            alt="website logo"
          />
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="username-input-field"
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>
          
          <button type="button" onClick={this.login} className="login-button">
            Login
          </button>

          
          <p className="input-label">Want to Join ?</p>
          <button type="button" onClick={this.wantsToJoin} className="want-to-join login-button">
            New User / Join
          </button>
          {showLoginError && <p className="error-message">*{loginErrorMsg}</p>}
        </div>
      </div>
      )
      
      
    )
  }
}
export default withRouter(Login)
