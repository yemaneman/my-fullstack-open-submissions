const Filter=(props)=>{

    return( 
        <div>
        <label htmlFor="filter" >filter ShownWith</label>
        <input type="text" id='filter' value={props.filter} onChange={props.handleFilterChange} />
       </div>
    )
}

export default Filter;