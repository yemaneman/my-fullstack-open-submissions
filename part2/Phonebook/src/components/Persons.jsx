const Persons=(props)=>{

  return(
     <ol>
        {props.personsToShow.map(person=><li key={person.name}>{person.name}{person.number}</li>)}
    </ol>
  )
}

export default Persons;