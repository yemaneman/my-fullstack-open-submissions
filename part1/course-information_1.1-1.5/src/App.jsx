const Header=(props)=>{
return(
  <h1>course:{props.course}</h1>
)
}
const Part1=(props)=>{
return(
  <p>part1:{props.part1} exercises1:{props.exercises1}</p>
)
}

const Part2=(props)=>{
return(
  <p>part2:{props.part2} exercises2:{props.exercises2}</p>
)
}

const Part3=(props)=>{
return(
  <p>part3:{props.part3} exercises3:{props.exercises3}</p>
)
}

const Content=(props)=>{
  return(
     <>
      <Part1 part1={props.part1} exercises1={props.exercises1}/>
      <Part2 part2={props.part2} exercises2={props.exercises2}/>
      <Part3 part3={props.part3} exercises3={props.exercises3}/>
      
 
    </>
  );
}

const Total=(props)=>{
  console.log(props)
  return(
    <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>  
  );
  
}
const App = () => {
  const course = {
      name :'Half Stack application development',
      parts: [
          {
            name:'Fundamentals of React',
            exersises:10
          },
          {
            name:'Using props to pass data',
            exersises:7
          },
          {
            name:'State of a component',
            exersises:14
          }
        ]
      }
 

  return (
    <div>
        <Header course={course.name}/>
        <Content part1={course.parts[0].name} part2={course.parts[1].name} part3={course.parts[2].name} exercises1={course.parts[0].exersises} exercises2={course.parts[1].exersises} exercises3={course.parts[2].exersises}/>
        <Total exercises1={course.parts[0].exersises} exercises2={course.parts[1].exersises} exercises3={course.parts[2].exersises}/>
    </div>
    
  )
}

export default App