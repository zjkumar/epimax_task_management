import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

import './styles.css'

const Profile = () => {
    const navigate = useNavigate();
    const displayOverlayWithCard = () => {
       
       let overlay = document.createElement('div')
       overlay.setAttribute('id', 'overlay')
       overlay.classList.add('overlay')
       overlay.onclick = function(){
        document.body.removeChild(overlay)
       }

       let profileCard = document.createElement('div')
       profileCard.classList.add('profile-card')

       let nameEl = document.createElement('p')
       nameEl.textContent = 'ganesh'

       let logoutBtn = document.createElement('button')
       logoutBtn.onclick = function(){
        console.log('logout clicked')
        
        Cookies.remove('jwt_token')
        navigate('/login')
       }

       logoutBtn.textContent = 'logout'

       profileCard.appendChild(nameEl)
       profileCard.appendChild(logoutBtn)

       overlay.appendChild(profileCard)


       document.body.appendChild(overlay) 


    }
    return (
        <div className="profile">
            <button type='button' className='profile-btn' onClick={displayOverlayWithCard}>{''}</button>
            <button type='button' className='arrow-btn' onClick={displayOverlayWithCard}>{'>'}</button>
        </div>
    )
}

export default Profile