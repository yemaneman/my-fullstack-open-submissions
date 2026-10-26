import {useState,useEffect} from 'react'
import axios from 'axios'
const App=()=>{
  const [value, setValue] = useState('')
  const [allCountries, setAllCountries] = useState([]) // Stores the master list from the API
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null) // For a "show" button if needed

  const handelCountryChange=(event)=>{
    setValue(event.target.value)
    setSelectedCountry(null)
    
  }
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )
  useEffect(()=>{
         axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
         .then(response=>{setAllCountries(response.data)})

          },[])


      useEffect(() => {
      // Determine the single country currently being shown
      const countryToShow = selectedCountry || (filteredCountries.length === 1 ? filteredCountries[0] : null)

      if (countryToShow && countryToShow.capital) {
        const capital = countryToShow.capital[0]
        const api_key = import.meta.env.VITE_WEATHER_KEY

        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
          .then(response => {
            setWeather(response.data)
          })
          .catch(error => {
            console.log('Error fetching weather data:', error)
            setWeather(null)
          })
      } else {
        setWeather(null) // Clear weather if not showing a single country
      }
    }, [filteredCountries, selectedCountry])

   return(
    <div>
      <label htmlFor="country">find countries:</label>
      <input type="text" id='country' value={value} onChange={handelCountryChange}/>
      {filteredCountries.length > 10 && value !== '' && (
        <p>Too many matches, specify another filter</p>
      )}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      )}
      {(filteredCountries.length === 1 || selectedCountry) && (() => {
        const countryToShow = selectedCountry || filteredCountries[0]
        return (
          <div>
            <h2>{countryToShow.name.common}</h2>
            <p>capital {countryToShow.capital}</p>
            <p>area {countryToShow.area}</p>
            
            <h3>languages:</h3>
            <ul>
              {Object.values(countryToShow.languages || {}).map(lang => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>

            <img 
              src={countryToShow.flags.png} 
              alt={countryToShow.flags.alt || `Flag of ${countryToShow.name.common}`} 
              width="150" 
            />
            {weather && (
          <div>
            <h3>Weather in {countryToShow.capital}</h3>
            <p>temperature {weather.main.temp} Celsius</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
            <p>wind {weather.wind.speed} m/s</p>
          </div>
        )}
          </div>
        )
      })()}
      
    </div>
   )
}
export default App;