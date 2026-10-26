import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/countryList'
import CountryDetail from './components/countryDetail'

const App = () => {
  const [value, setValue] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch all countries on initial load
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const handleCountryChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null) // Reset selection when user types a new search
  }

  // Filter countries based on input
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  // Determine if a single country should be displayed
  const countryToShow = selectedCountry || (filteredCountries.length === 1 ? filteredCountries[0] : null)

  return (
    <div>
      <label htmlFor="country">find countries: </label>
      <input 
        type="text" 
        id="country" 
        value={value} 
        onChange={handleCountryChange} 
      />

      {filteredCountries.length > 10 && value !== '' && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length <= 10 && filteredCountries.length > 1 && !selectedCountry && (
        <CountryList countries={filteredCountries} onShow={setSelectedCountry} />
      )}

      {countryToShow && (
        <CountryDetail country={countryToShow} />
      )}
    </div>
  )
}

export default App