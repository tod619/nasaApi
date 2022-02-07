const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')

// NASA API
const count = 10
const apiKey = "DEMO_KEY"
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}

function showContent() {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    })
    loader.classList.add('hidden')
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div')
        card.classList.add('card')
        // Create Link
        const link = document.createElement('a')
        link.href = result.hdurl
        link.title = 'View Full Image'
        link.target = '_blank'
        // Create Image
        const image = document.createElement('img')
        image.src = result.url
        image.alt = 'NASA Picture of the Day'
        image.loading = 'lazy'
        image.classList.add('card-image-top')
        // Create Card Body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        // Create Card Title
        const cardTitle = document.createElement('h5')
        card.classList.add('card-title')
        cardTitle.textContent = result.title
        // Save Text
        const saveText = document.createElement('p')
        saveText.classList.add('clickable')
        if(page === 'results') {
            saveText.textContent = 'Add To Favorites'
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`)
        } else {
            saveText.textContent = 'Remove Favorite'
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
        }
        // Card Text
        const cardText = document.createElement('p')
        cardText.textContent = result.explanation
        // Footer container
        const footer = document.createElement('small')
        footer.classList.add('muted')
        // Footer Date
        const date = document.createElement('strong')
        date.textContent = result.date
        // Footer copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright
        const copyright = document.createElement('span')
        copyright.textContent = ` ${copyrightResult}`

        // Append everything together
        footer.append(date, copyright)
        cardBody.append(cardTitle, saveText, cardText, footer)
        link.appendChild(image)
        card.append(link, cardBody)

        // Add card to images container
        imagesContainer.appendChild(card)
    
    })
}

function updateDOM(page) {
    // Get Favorites From LocalStorage
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent = ''
    createDOMNodes(page)
    showContent()
}

// Get 10 images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden')
    try {
        const response = await fetch(apiURL)
        resultsArray = await response.json()
        console.log(resultsArray)
        updateDOM('results')
    } catch(error) {
        // Catch error here
        console.log(error)
    }
}


// As result to favorites
function saveFavorite(itemUrl) {
    // Loop through results array to get info
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item

            // Show saved confirmation message for 2 seconds and disappear
            saveConfirmed.hidden = false
            setTimeout(()=> {
                saveConfirmed.hidden = true
            }, 2000)

            // Set Favorites in local storage
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites))
        }
    })
}

// Remove Item from favorites
function removeFavorite(itemURL) {
    if(favorites[itemURL]) {
        delete favorites[itemURL]

        // Set Favorites in local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites))
        updateDOM('favorites')
    }
}

// On Load
getNasaPictures()