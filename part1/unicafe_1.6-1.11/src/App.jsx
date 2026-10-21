import { useState } from "react";
const Button=(props)=><button onClick={props.onClick}>{props.text}</button>
const StasticLine=({text,value})=>
    {
     return(<tr>
             <td>{text}:</td> 
             <td>{value}</td>
           </tr>)
    }
const Statistics=({good,neutral,bad,all})=>{
  if(all===0){
    return <p>No feedback given</p>
  }
   const average=((good*1)+(neutral*0)+(bad*-1))/all;
   const positive=`${(good/all)*100}%`;
   return(
      <>
        <table>
          <tbody>
              <StasticLine text='Good' value={good}/>
              <StasticLine text="Neutral" value={neutral}/>
              <StasticLine text='Bad' value={bad}/>
              <StasticLine text='All' value={all}/>
              <StasticLine text='Average' value={average}/>
              <StasticLine text='Positive' value={positive}/>
          </tbody>
          
        </table>
       </>

   ) 
  

}
          
const App=()=>{
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const[all,setAll]=useState(0)
  const handleGoodClicks=()=>{
        setGood(good+1)
        setAll(all+1)
        
        
      }
  const handleNeutralClicks=()=>{
        setNeutral(neutral+1)
        setAll(all+1)
        
      }
  const handleBadClicks=()=>{
        setBad(bad+1)
        setAll(all+1)
        
      }
 
  return(
    <>
    <h1>give feedback</h1>
    <Button onClick={handleGoodClicks} text='Good'/>
    <Button onClick={handleNeutralClicks} text='Neutral'/>
    <Button onClick={handleBadClicks} text='Bad'/>
    <h1>Statistics</h1>
    <Statistics good={good} bad={bad} neutral={neutral} all={all}/>
    </>
  )
}

export default App;