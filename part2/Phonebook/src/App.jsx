import {useState} from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
const App=()=>{
  const[persons,setPersons]=useState([{name:'artur',number:'0914'},{name:'yeme',number:'0986'}])
  const[newName,setNewName]=useState('hy')
  const[newNumber,setNewNumber]=useState('09')
  const[filter,setfilter]=useState('')


  const addPerson=(event)=>{
   event.preventDefault();
   const nameExists=persons.some(person=>person.name===newName)
   if(nameExists){
     alert(`${newName} is already added to the Phonebook`)
     return
    }
   console.log(event.target)
   const personObject={
    name:newName,
    number:newNumber,
   }
   setPersons(persons.concat(personObject))
   setNewName('')
   setNewNumber('')
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
  
  const personsToShow=persons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))
 
  return(
      <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a New</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}/>
    </div>
       
      )
}
export default App;