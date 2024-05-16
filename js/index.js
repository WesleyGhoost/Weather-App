const apiKeyWeather = '338848c4ffb5736217421c0434c78e43'
const apiKeyUnsplash = '8v1656hcGMs1L3qows5TiWLpwpOJNBgC7pSMvj3KyPc'

const cityInput = document.querySelector('#city-input')
const searchBtn = document.querySelector('#search')

const body = document.querySelector('body')
const cityElement = document.querySelector('#city')
const tempElement = document.querySelector('#temperature span')
const descElement = document.querySelector('#description')
const weatherContainer = document.querySelector('#weather-data')
const weatherIconElement = document.querySelector('#weather-icon')
const countryElement = document.querySelector('#country')
const humidity = document.querySelector('#humidity span')
const wind = document.querySelector('#wind span')

const loader = document.querySelector('#loader')

const errorContainer = document.querySelector('#error-container')
const errorMessage = document.querySelector('#error-message')

const getWeatherData = async (city) => {
    try {
        const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKeyWeather}&lang=pt_br`
        const res = await fetch(apiWeatherURL)
        const data = await res.json()
        return data
    } catch (err) {
        errorContainer.style.display = 'block'
        errorMessage.innerText = `Não foi possível obter os dados do clima: ${err.status}`
    }
}

const showWeatherData = async (city) => {
    try {
        loader.style.display = 'block'
        const data = await getWeatherData(city)
        cityElement.innerText = data.name
        tempElement.innerText = parseInt(data.main.temp)
        descElement.innerText = data.weather[0].description
        weatherIconElement.setAttribute(
            'src',
            `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        )
        const apiCountryURL = `https://flagsapi.com/${data.sys.country}/flat/64.png`
        countryElement.setAttribute('src', apiCountryURL)
        humidity.innerText = `${data.main.humidity}%`
        wind.innerText = `${data.wind.speed}km/h`
        weatherContainer.style.display = 'block'
        changeCityImage(city)
    } catch (err) {
        if (city.value == undefined) {
            errorContainer.style.display = 'block'
            errorMessage.innerText = 'Por favor insira um nome de cidade válido.'
        } else {
            errorContainer.style.display = 'block'
            errorMessage.innerText = `Não foi possível exibir os dados: ${err.status}`
        }
    } finally {
        loader.style.display = 'none'
    }
}

const changeCityImage = (city) => {
    fetch(`https://api.unsplash.com/search/photos?query=${city}+landscape&client_id=${apiKeyUnsplash}`)
        .then(response => response.json())
        .then(data => {
            const cityImageUrl = data.results[0].urls.full
            body.style.backgroundImage = 'url(' + cityImageUrl + ')'
        })
        .catch = () => {
            body.style.backgroundImage = 'none'
        }
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const city = cityInput.value
    showWeatherData(city)
    errorContainer.style.display = 'none'
})

cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        const city = cityInput.value
        showWeatherData(city)
        errorContainer.style.display = 'none'
    }
})