import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

import './styles.css'

const Profile = () => {
    const navigate = useNavigate();

    const displayOverlayWithCard = () => {
       
        const username = Cookies.get('username')

       let overlay = document.createElement('div')
       overlay.setAttribute('id', 'overlay')
       overlay.classList.add('overlay')
       overlay.onclick = function(){
        document.body.removeChild(overlay)
       }

       let profileCard = document.createElement('div')
       profileCard.classList.add('profile-card')

       let nameEl = document.createElement('p')
       nameEl.textContent = username
       nameEl.classList.add('username')

       let logoutBtn = document.createElement('button')
       logoutBtn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()

        document.body.removeChild(overlay)
        console.log('logout clicked')
        Cookies.remove('jwt_token')

        console.log(Cookies.get('jwt_token'), 'this is jwt token')
        Cookies.remove('username')
        navigate('/login')
       })

       logoutBtn.textContent = 'Logout'
       logoutBtn.classList.add('logout-btn')

       profileCard.appendChild(nameEl)
       profileCard.appendChild(logoutBtn)

       overlay.appendChild(profileCard)


       document.body.appendChild(overlay) 


    }
    return (
        <div className="profile">
            <button type='button' className='profile-btn' onClick={displayOverlayWithCard}>
                <img src='https://res.cloudinary.com/n0ta10sear/image/upload/v1714741836/user-avatar_fops30.png' alt='avatar' className='profile-img' />
            </button>
            <button type='button' className='arrow-btn' onClick={displayOverlayWithCard}>{'>'}</button>
        </div>
    )
}

export default Profile