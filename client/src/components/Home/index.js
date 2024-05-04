import {Component} from 'react'

import Cookies from 'js-cookie'
import Navbar from '../Navbar'

import {TailSpin} from 'react-loader-spinner'

import './styles.css'

const localhost = 'http://localhost:5000'
const globalhost = 'https://epimax-task-management-backend.onrender.com'

const currentHost = globalhost

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

        const url = currentHost
        const token = Cookies.get('jwt_token')
        

        const options = {
            method: 'GET',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
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

    

    saveTheTask = async (section_id, task, priority, assignee ) => {
        const token = Cookies.get('jwt_token')
        const url = currentHost + '/save-task'

        const details = {section_id, task, priority, assignee}
        const options = {
            method: 'POST',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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

    // updateTheTask = async updatedSections => {
    //     const url = currentHost + '/updateTask'
    //     const token = Cookies.get('jwt_token')
    //     const details = {updatedSections}

    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(details)
    //     }

    //     const response = await fetch(url, options)
    //     const data = await response.json()

    //     if (response.ok === true){
    //         console.log('update success')
    //         this.fetchSectionsAndTasks()
    //     }else{
    //         console.log(data)
    //     }
    // }

    updateTask = async (task_id, section_id, columnName, userInput) => {
        const url = currentHost + '/updateTask'
        const token = Cookies.get('jwt_token')
        const details = {task_id, section_id, columnName, userInput}

        console.log({task_id, section_id, columnName, userInput})

        const options = {
            method: 'POST',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
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

    createOverlay = () => {
        const overlay = document.createElement('div')
        
        overlay.classList.add('overlay')
        overlay.setAttribute('id', 'overlay')

        document.body.appendChild(overlay)
        
        overlay.onclick = function(){
          document.body.removeChild(overlay)
          return null
        }
        return overlay
    }

    createCardOnOverlay = () => {
        let cardOnOverlay = document.createElement('div')
        cardOnOverlay.classList.add('task-card')

        cardOnOverlay.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to parent elements
        });

        return cardOnOverlay
    }

    createCardWithButtons = array => {
        let buttonsCard = document.createElement('div')

        for (let each of array){
            let btn = document.createElement('button')
            btn.classList.add('section-options-card-each-btn')
            btn.textContent = each
            buttonsCard.appendChild(btn)
        }
        return buttonsCard
    }

    createLabelInputs = array => {
        
        const inputLabelHolder = document.createElement('div')
        for (let each of array){
            const labelEl = document.createElement('label')
            const inputEl = document.createElement('input')
            inputEl.setAttribute('id', each)
            labelEl.setAttribute('htmlFor', each)

            labelEl.textContent = each

            inputLabelHolder.appendChild(labelEl)
            inputLabelHolder.appendChild(inputEl)
        }

        return inputLabelHolder
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


    // <div className='buttons-holder'>
    //             <button type='button' onClick={() => {

    //             }}>Save</button>
    //             <button type='button' onClick={() => {

    //             }}>Save</button>

    //         </div>

    modifySectionName = async (section_id, userInput) => {
        console.log('hit the section name function')
        // return
        const url = currentHost + '/modifySection'
        const token = Cookies.get('jwt_token')
        const details = { section_id,  userInput}

        console.log({section_id,  userInput})

        const options = {
            method: 'POST',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
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

    deleteSection = async (section_id) => {
        const url = currentHost + '/deleteSection'
        const token = Cookies.get('jwt_token')
        const details = { section_id}

        console.log({section_id})

        const options = {
            method: 'DELETE',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'section_id' : section_id
            }
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok === true){
            console.log('Section deleted successfully')
            this.fetchSectionsAndTasks()
        }else{
            console.log(data)
        }
    }


    displayOptionsForSection = (section_id) => {
        const overlayForSectionOptions = this.createOverlay()
        overlayForSectionOptions.classList.add('home-overlay')

        document.body.appendChild(overlayForSectionOptions)

        const sectionOptionsCard = this.createCardWithButtons(['Rename Section', 'Delete Section'])

        sectionOptionsCard.classList.add('section-options-card')
        // console.log(sectionOptionsCard.children)
        // console.log(sectionOptionsCard)
        // return

        // Convert HTMLCollection to array
        const buttonsArray = Array.from(sectionOptionsCard.children);

        // access individual elements.
        const renameSectionBtn = buttonsArray[0];
        const deleteSectionBtn = buttonsArray[1];

        renameSectionBtn.addEventListener('click', event => {
            event.preventDefault(); // Prevent default form submission behavior
            event.stopPropagation(); // Stop event propagation to parent elements
            
            // create overlay on top of current overlay
            const overlayToRenameSection = this.createOverlay()
            overlayToRenameSection.classList.add('home-overlay')

            document.body.appendChild(overlayToRenameSection)

            // create a card to display on the current overlay
            const cardToRenameSection = this.createCardOnOverlay()
            cardToRenameSection.classList.add('overlay-card')


            overlayToRenameSection.appendChild(cardToRenameSection)


            // create label and input elements 
            const inputsToRename = this.createLabelInputs(['Rename Section'])
            cardToRenameSection.appendChild(inputsToRename)

            const buttonsHolder =  document.createElement('div') 
            cardToRenameSection.appendChild(buttonsHolder)
            
            const saveBtn = document.createElement('button')
            saveBtn.textContent = 'Save'
            saveBtn.classList.add('save-btn')

            const cancelBtn = document.createElement('button')
            cancelBtn.textContent = 'Cancel'
            cancelBtn.classList.add('cancel-btn')

            buttonsHolder.appendChild(saveBtn)
            buttonsHolder.appendChild(cancelBtn)


            
            saveBtn.addEventListener('click', event => {
                let errorElId = 'errorParaEl'
                event.preventDefault()
                event.stopPropagation()

                const userInput = document.getElementById('Rename Section').value
                
                let errorEl = document.createElement('p')
                errorEl.setAttribute("id", errorElId)
                
                
                if (userInput === ''){
                    const hasChildWithId = Array.from(cardToRenameSection.children).some(child => child.id === 'errorParaEl');
                    
                    const errMsg = 'Section name cannot be empty'
                    errorEl.textContent = errMsg
                                   
                    if (hasChildWithId){
                        return
                    }else{
                        cardToRenameSection.appendChild(errorEl)
                        errorEl.classList.add('error-msg')
                    }
                    return
                }
                errorEl.textContent = ''
                document.body.removeChild(overlayToRenameSection)
                document.body.removeChild(overlayForSectionOptions)
                this.modifySectionName(section_id, userInput)
            })
            cancelBtn.addEventListener('click', event => {
                event.preventDefault()
                event.stopPropagation()
                document.body.removeChild(overlayToRenameSection)           
            })
        })

        

        deleteSectionBtn.addEventListener('click', event => {
            event.preventDefault(); // Prevent default form submission behavior
            event.stopPropagation(); // Stop event propagation to parent elements
            
            // create overlay on top of current overlay
            const overlayToDeleteSection = this.createOverlay()
            overlayToDeleteSection.classList.add('home-overlay')

            document.body.appendChild(overlayToDeleteSection)

            // create a card to display on the current overlay
            const cardToDeleteSection = this.createCardOnOverlay()
            cardToDeleteSection.classList.add('overlay-card', 'card-to-delete-section')


            overlayToDeleteSection.appendChild(cardToDeleteSection)


            // create a caution message asking the user if he/she wants to delete the section 
            const cautionEl = document.createElement('h1');
            cautionEl.textContent = 'Are you sure you want to delete the section ? All the tasks of the section will be deleted. Select "Yes" to "Delete" the section and "No" to "Cancel"'
            cardToDeleteSection.appendChild(cautionEl)




            const buttonsHolder =  document.createElement('div') 
            cardToDeleteSection.appendChild(buttonsHolder)
            
            const yesBtn = document.createElement('button')
            yesBtn.textContent = 'Yes'
            yesBtn.classList.add('yes-btn')

            const noBtn = document.createElement('button')
            noBtn.textContent = 'No'
            noBtn.classList.add('no-btn')

            buttonsHolder.appendChild(yesBtn)
            buttonsHolder.appendChild(noBtn)


            
            yesBtn.addEventListener('click', event => {
                event.preventDefault()
                event.stopPropagation()

                document.body.removeChild(overlayToDeleteSection)
                document.body.removeChild(overlayForSectionOptions)
                this.deleteSection(section_id)
            })

            noBtn.addEventListener('click', event => {
                event.preventDefault()
                event.stopPropagation()
                document.body.removeChild(overlayToDeleteSection)    
                document.body.removeChild(overlayForSectionOptions)       
            })
        })

        overlayForSectionOptions.appendChild(sectionOptionsCard)
    }


    clientRequestToCreateSection = async (userInput) => {

        const url = currentHost + '/createNewSection'
        const token = Cookies.get('jwt_token')
        const details = { userInput}
    
        console.log({userInput})
    
        const options = {
            method: 'POST',
            mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
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
    
    
    
    createNewSection = () => {
        const overlayToCreateSection = this.createOverlay()
        overlayToCreateSection.classList.add('home-overlay')
    
        document.body.appendChild(overlayToCreateSection)
    
        // create a card to display on the current overlay
        const cardToCreateSection = this.createCardOnOverlay()
        cardToCreateSection.classList.add('overlay-card')
    
    
        overlayToCreateSection.appendChild(cardToCreateSection)
    
    
        // create label and input elements 
        const inputsToCreate = this.createLabelInputs(['Name of Your Section'])
        cardToCreateSection.appendChild(inputsToCreate)
    
        const buttonsHolder =  document.createElement('div') 
        cardToCreateSection.appendChild(buttonsHolder)
        
        const saveBtn = document.createElement('button')
        saveBtn.textContent = 'Save'
        saveBtn.classList.add('save-btn')
    
        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = 'Cancel'
        cancelBtn.classList.add('cancel-btn')
    
        buttonsHolder.appendChild(saveBtn)
        buttonsHolder.appendChild(cancelBtn)
    
    
        
        saveBtn.addEventListener('click', event => {
            let errorElId = 'errorParaEl'
            event.preventDefault()
            event.stopPropagation()
    
            const userInput = document.getElementById('Name of Your Section').value
            
            let errorEl = document.createElement('p')
            errorEl.setAttribute("id", errorElId)
            
            
            if (userInput === ''){
                const hasChildWithId = Array.from(cardToCreateSection.children).some(child => child.id === 'errorParaEl');
                
                const errMsg = 'Section name cannot be empty'
                errorEl.textContent = errMsg
                                
                if (hasChildWithId){
                    return
                }else{
                    cardToCreateSection.appendChild(errorEl)
                    errorEl.classList.add('error-msg')
                }
                return
            }
            errorEl.textContent = ''
            document.body.removeChild(overlayToCreateSection)
            this.clientRequestToCreateSection(userInput)
        })
        cancelBtn.addEventListener('click', event => {
            event.preventDefault()
            event.stopPropagation()
            document.body.removeChild(overlayToCreateSection)           
        })
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
                    <div className='create-new-section-box'>
                        <button className='create-new-section-btn' onClick={this.createNewSection}>Create New Section</button>
                    </div>
                    {sections.map(eachSectionObj => {
                        const {section_id, section_name, tasks} = eachSectionObj
                        return <div className='task-section' key={section_name + section_id}>
                            <div className='section-name-btn-div'>
                                <h1 style={{color: "rgb(44, 134, 186)"}}>{section_name}</h1>
                                <button className='add-task-plus-btn' type='button' onClick={() => {
                                    this.addTaskToSection(section_id)
                                }}>+</button>
                                <button className='section-options-three-dots-btn' type='button' onClick={() => {
                                    this.displayOptionsForSection(section_id)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                    </svg>
                                </button>
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