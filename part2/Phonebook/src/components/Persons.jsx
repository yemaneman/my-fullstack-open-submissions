const Persons=(props)=>{

  return(
     <ol>
        {props.personsToShow.
        map(person=>{ return(<li key={person.name} >{person.name}{person.number} <button  onClick={()=>props.deletePerson(person.id)}>delete</button></li>
                    )}
        )}
    </ol>
  )
}

export default Persons;