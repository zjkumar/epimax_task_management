import {Component} from 'react'

import Cookies from 'js-cookie'
import Navbar from '../Navbar'

import {TailSpin} from 'react-loader-spinner'

import './styles.css'

class Home extends Component{
    state = {
        sections: null,
    }

    componentDidMount(){
        // getting sections of the current user
        // getting tasks of each section
        this.fetchSectionsAndTasks()
    }

    fetchSectionsAndTasks = async () => {

        console.log('fetching sections and tasks')

        const url = 'http://localhost:3000/'
        const token = Cookies.get('jwt_token')
        

        const options = {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
        const {sections} = data

        console.log(sections, 'these are new sections')
        this.setState({sections})
    }

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

    saveTheTask = async (section_id, task, priority, assignee ) => {
        const token = Cookies.get('jwt_token')
        const url = 'http://localhost:3000/save-task'

        const details = {section_id, task, priority, assignee}
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
              },
            
            body: JSON.stringify(details)
        }

        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok === true){
            console.log('saved the task succesfully')
            document.body.removeChild(document.getElementById('taskOverlay'))
            this.fetchSectionsAndTasks()

        }else{
            console.log('saved the task failure')
            document.body.removeChild(document.getElementById('taskOverlay'))
        }
    }

    addTaskToSection = sectionId => {
        const addTaskOverlay = document.createElement('div')
        
        addTaskOverlay.classList.add('overlay', 'task-overlay')
        addTaskOverlay.setAttribute('id', 'taskOverlay')

        document.body.appendChild(addTaskOverlay)
        
        addTaskOverlay.onclick = function(){
            // console.log('overlay clicked')
            document.body.removeChild(addTaskOverlay)
           
        }

        let taskCard = document.createElement('div')
        taskCard.classList.add('task-card')

        taskCard.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to parent elements
        });

       addTaskOverlay.appendChild(taskCard)
       
       let taskNameDiv = document.createElement('div')
       taskNameDiv.classList.add('input-container')

       let taskNameLabel = document.createElement('label')
       let taskNameInput = document.createElement('input')

       taskNameDiv.appendChild(taskNameLabel)
       taskNameDiv.appendChild(taskNameInput)

       taskNameLabel.textContent = 'Task Name'
       taskNameLabel.setAttribute('htmlFor', 'taskName')
       taskNameInput.setAttribute('id', 'taskName')


       let taskPriorityDiv = document.createElement('div')
       taskPriorityDiv.classList.add('input-container')

       let taskPriorityLabel = document.createElement('label')
       let taskPriorityInput = document.createElement('input')


       taskPriorityDiv.appendChild(taskPriorityLabel)
       taskPriorityDiv.appendChild(taskPriorityInput)

       taskPriorityLabel.textContent = 'Priority'
       taskPriorityLabel.setAttribute('htmlFor', 'taskPriority')
       taskPriorityInput.setAttribute('id', 'taskPriority')


       let taskAssigneeDiv = document.createElement('div')
       taskAssigneeDiv.classList.add('input-container')
       
       let taskAssigneeLabel = document.createElement('label')
       let taskAssigneeInput = document.createElement('input')

       
       taskAssigneeDiv.appendChild(taskAssigneeLabel)
       taskAssigneeDiv.appendChild(taskAssigneeInput)

       taskAssigneeLabel.textContent = 'Assignee'
       taskAssigneeLabel.setAttribute('htmlFor', 'taskAssignee')
       taskAssigneeInput.setAttribute('id', 'taskAssignee')

       let buttonsContainer = document.createElement('div')
       buttonsContainer.classList.add('buttons-container')

       let saveBtn = document.createElement('button')
       saveBtn.classList.add('save-btn')
       saveBtn.textContent = 'Save'
       
       let cancelBtn = document.createElement('button')
       cancelBtn.classList.add('cancel-btn')
       cancelBtn.textContent = 'Cancel'
      

       buttonsContainer.appendChild(saveBtn)
       buttonsContainer.appendChild(cancelBtn)

       saveBtn.addEventListener('click', event => {
        event.preventDefault(); // Prevent default form submission behavior
        event.stopPropagation(); // Stop event propagation to parent elements
         let task = document.getElementById('taskName').value
         let priority = document.getElementById('taskPriority').value
         let assignee = document.getElementById('taskAssignee').value

         if (task === ''){
            console.log(task, 'empty task')
            let taskError = document.createElement('p')
            let errMsg = 'Task cannot be empty'
            taskError.textContent = errMsg
            taskError.classList.add('task-error')
            
            taskCard.appendChild(taskError)
            return
         }
         this.saveTheTask(sectionId, task, priority, assignee )
          
       })

       cancelBtn.addEventListener('click', event => {
        event.preventDefault(); // Prevent default form submission behavior
       event.stopPropagation(); // Stop event propagation to parent elements
        document.body.removeChild(addTaskOverlay)
       })

       taskCard.appendChild(taskNameDiv)
       taskCard.appendChild(taskPriorityDiv)
       taskCard.appendChild(taskAssigneeDiv)
       
       taskCard.appendChild(buttonsContainer)

    }

    updateTheTask = async updatedSections => {
        const url = 'http://localhost:3000/updateTask'
        const token = Cookies.get('jwt_token')
        const details = {updatedSections}

        const options = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok === true){
            console.log('update success')
            this.fetchSectionsAndTasks()
        }else{
            console.log(data)
        }
    }

    updateTask = async (task_id, section_id, columnName, userInput) => {
        const url = 'http://localhost:3000/updateTask'
        const token = Cookies.get('jwt_token')
        const details = {task_id, section_id, columnName, userInput}

        console.log({task_id, section_id, columnName, userInput})

        const options = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok === true){
            console.log('update success')
            this.fetchSectionsAndTasks()
        }else{
            console.log(data)
        }
    }


    displayInputToUpdateTheTask = (section_id, task_id, columnName) => {
        const updateTaskOverlay = document.createElement('div')
        
        updateTaskOverlay.classList.add('overlay', 'update-task-overlay')
        updateTaskOverlay.setAttribute('id', 'updateTaskOverlay')

        document.body.appendChild(updateTaskOverlay)
        
        updateTaskOverlay.onclick = function(){
          document.body.removeChild(updateTaskOverlay)
          return null
        }

        let updateTaskCard = document.createElement('div')
        updateTaskCard.classList.add('task-card')

        updateTaskOverlay.appendChild(updateTaskCard)

        updateTaskCard.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to parent elements
        });

        let columnNameLabel = document.createElement('label')
        let columnNameInput = document.createElement('input')

        columnNameInput.setAttribute('id', `columnName${columnName + task_id}`)
        columnNameLabel.setAttribute('htmlFor', `columnName${columnName + task_id}`)

        columnNameLabel.textContent = columnName
        
        let buttonsContainer = document.createElement('div')
        buttonsContainer.classList.add('buttons-container')

        let saveBtn = document.createElement('button')
        saveBtn.classList.add('save-btn')
        saveBtn.textContent = 'Save'

        saveBtn.addEventListener('click', event => {
            event.stopPropagation()
            let userInput = document.getElementById(`columnName${columnName + task_id}`).value
            if (userInput === ''){
                let updateTaskError = document.createElement('p')
                let errMsg = 'Task cannot be empty'
                updateTaskError.textContent = errMsg
                updateTaskError.classList.add('update-task-error')
                
                updateTaskCard.appendChild(updateTaskError)
                return  
            }
            
            
            this.updateTask(task_id, section_id, columnName, userInput)
            // this.updateTheTask(updatedSections)

            document.body.removeChild(updateTaskOverlay)
            
        })
       
        let cancelBtn = document.createElement('button')
        cancelBtn.classList.add('cancel-btn')
        cancelBtn.textContent = 'Cancel'

        cancelBtn.addEventListener('click', event => {
            event.stopPropagation()
            document.body.removeChild(updateTaskOverlay)
            return null
        })
      

        buttonsContainer.appendChild(saveBtn)
        buttonsContainer.appendChild(cancelBtn)

        updateTaskCard.appendChild(columnNameLabel)
        updateTaskCard.appendChild(columnNameInput)
        updateTaskCard.appendChild(buttonsContainer)

    }

    changeTaskName = async(section_id, task_id, event) => {
        event.stopPropagation()
        this.displayInputToUpdateTheTask(section_id, task_id,'task_name')
    }
    changeAssignee = async(section_id, task_id, event) => {
        event.stopPropagation()
        this.displayInputToUpdateTheTask(section_id, task_id, 'assignee')
    }
    changePriority = async(section_id, task_id, event) => {
        event.stopPropagation()
        this.displayInputToUpdateTheTask(section_id, task_id, 'priority')
    }

    render(){
        const {sections} = this.state
        return (
            <>
                <Navbar />
                {sections == null ? <div className='loading-screen'>
                    <TailSpin type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
                </div> :
                <div className='home'>
                    <div className='table-columns'>
                        <p className='table-col-name'>Task Name</p>
                        <p className='table-col-assignee'>Assignee</p>
                        <p className='table-col-priority'>Priority</p>
                    </div>
                    {sections.map(eachSectionObj => {
                        const {section_id, section_name, tasks} = eachSectionObj
                        return <div className='task-section' key={section_name + section_id}>
                            <div className='section-name-btn-div'>
                                <h1>{section_name}</h1>
                                <button className='add-task-plus-btn' type='button' onClick={() => {
                                    this.addTaskToSection(section_id)
                                }}>+</button>
                            </div>
                            <ul className='sections-container'>
                                {tasks.map((eachTaskObj, index) => {
                                    const {task_id, task_name, assignee, priority} = eachTaskObj
                                    return (
                                        <li className='task' key={task_id}>
                                            <p id={`taskName${task_id}`} onClick={(event) => {
                                                this.changeTaskName(section_id, task_id, event)
                                            }} className='updatable-col task-col-name table-col-name'>{task_name}</p>
                                            <p id={`assignee${task_id}`} onClick={(event) => {
                                                this.changeAssignee(section_id, task_id, event)
                                            }} className='updatable-col table-col-assignee'>{assignee}</p>
                                            <p id={`priority${task_id}`} onClick={(event) => {
                                                this.changePriority(section_id, task_id, event)
                                            }} className='updatable-col table-col-priority'>{priority}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    })}
                </div>}
            </>
        )
    }
}

export default Home