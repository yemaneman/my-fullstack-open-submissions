const Notification=({message,type})=>{
    const className=type==='error'?'errorMessage':'notificationMessage'
    
    if(message===null){
        return null
    }


    return(
        <div className={className}>
          {message}
        </div>
    )
}
export default Notification;