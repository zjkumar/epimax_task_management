import {Component} from 'react'
import Navbar from '../Navbar'

class Home extends Component{

    addUser = async () => {
        let fullName = 'jagadeesh kumar'
        let username = 'jk'

        let details = {
            fullName, username
        }

        let url = 'http://localhost:3000/create-user'

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(details)
        }
        const response = await fetch(url, options)
        console.log(response, 'this is response')
        const data = await response.json()
        console.log(data)
    }
    render(){
        return (
            <>
                <Navbar />
                <div className='home'>
                    <button type='button' onClick={this.addUser}>Add User</button>
                </div>
            </>
        )
    }
}

export default Home