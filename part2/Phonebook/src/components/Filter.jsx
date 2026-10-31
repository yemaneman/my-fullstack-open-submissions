const Filter = (props) => {
  return ( 
    <div className="filter-container">
      <label htmlFor="filter" className="filter-label">
        filter ShownWith
      </label>
      <input 
        type="text" 
        id="filter" 
        className="filter-input"
        value={props.filter} 
        onChange={props.handleFilterChange} 
      />
    </div>
  )
}

export default Filter