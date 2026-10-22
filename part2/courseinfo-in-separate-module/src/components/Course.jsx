const Part=({part})=><p>{part.name}{part.exercises}</p>

const Content=({parts})=>{
   const totalExercise=parts.reduce((sum,part)=>sum+part.exercises,0)
   return(
    <div>
   {parts.map(part=><Part key={part.id} part={part}/>)} 
   <p><strong>total of {totalExercise} exercises</strong></p>
   </div>
   )
  }
   
const Header=(props)=><h1>{props.course.name}</h1>
const Course=(props)=>{
  return(
        <div>
         <Header course={props.course} />
         <Content parts={props.course.parts}/> 
        </div>
    )
}
export default Course;