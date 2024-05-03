import {Link} from 'react-router-dom'

import Profile from '../Profile'

import './index.css'

const Navbar = () => (
    <div className="navbar">
        <img className='nav-website-logo' src='https://res.cloudinary.com/n0ta10sear/image/upload/v1714538319/epimax_task_management_logo_dpv4zl.png' alt='website logo' />
        <ul className='links'>
            <li><Link to='/'>Home</Link></li>
        </ul>
        <Profile />
    </div>
)

export default Navbar