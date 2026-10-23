
const PersonForm=(props)=>{

    return(
        <>
         <form onSubmit={props.addPerson}>
        <div>
          <label htmlFor="name">name:</label>
         <input id='name' value={props.newName} onChange={props.handleNameChange} autoComplete='name'/>
        </div>
        <div>
        <label htmlFor="number">number:</label>
         <input id='number' value={props.newNumber} onChange={props.handleNumberChange} autoComplete='number'/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> 
        </>
    )
}

export default PersonForm;