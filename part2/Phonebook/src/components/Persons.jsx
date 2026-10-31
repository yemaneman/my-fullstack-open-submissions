const Persons=(props)=>{

  return(
     <ol className="contact-list">
  {props.personsToShow.map(person => {
    return (
      <li key={person.id}>
        <span className="contact-info">
          <span className="contact-name">{person.name}</span>
          <span className="contact-number">{person.number}</span>
        </span>
        <button onClick={() => props.deletePerson(person.id)}>
          delete
        </button>
      </li>
    )
  })}
</ol>
  )
}

export default Persons;