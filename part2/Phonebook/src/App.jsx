import {useEffect, useState} from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
const App=()=>{
  const[persons,setPersons]=useState([])
  const[newName,setNewName]=useState('hy')
  const[newNumber,setNewNumber]=useState('09')
  const[filter,setfilter]=useState('')

  useEffect(()=>{phonebookService.getAll().then(intialPersons=>setPersons(intialPersons))},[])
  const addPerson=(event)=>{
   event.preventDefault();
   const existingPerson=persons.find(p=>p.name===newName);
   if(existingPerson){
     if(window.confirm(`${newName} is already added to the phonebook ,replace the old number with a new one?`)){
       const changedPerson={...existingPerson,number:newNumber}
       phonebookService.update(existingPerson.id,changedPerson)
          .then(returnedPerson=>{
            setPersons(persons.map(p=>p.id!==existingPerson.id?p:returnedPerson))
            setNewName('')
            setNewNumber('')
          }).catch(()=>{
            alert(`Information of ${existingPerson.name} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
     }
     return
   }
   const personObject={
    name:newName,
    number:newNumber,
   }
    phonebookService.create(personObject).then(returnedData=>setPersons(persons.concat(returnedData)),
      setNewName(''),
      setNewNumber(''))

  }
  
  const handleNameChange=(event)=>{
   setNewName(event.target.value)
  }
  const handleNumberChange=(event)=>{
   setNewNumber(event.target.value)
  }
  const handleFilterChange=(event)=>{
    setfilter(event.target.value);
  }
  const deletePerson=(id)=>{
   const person=persons.find(p=>p.id===id)
   if(window.confirm(`Delete ${person.name} ?`)){
    phonebookService.Delete(id)
    .then(()=>{setPersons(persons.filter(person=>person.id!==id))}).catch(error=>{
      console.log('we could not delete the person',error )
    })

  }
  }
  const personsToShow=persons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))
 
  return(
      <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a New</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
       
      )
}
export default App;