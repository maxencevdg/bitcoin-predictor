document.addEventListener('DOMContentLoaded', function () {
    // Appel de la fonction pour récupérer le prix du Bitcoin
    fetchBitcoinPrice()

    // Initialisation des variables
    let lastBitcoinPrice = 'Pas encore de prix' // Dernier prix du Bitcoin récupéré
    let previousBitcoinPrice = null // Prix du Bitcoin précédent
    let isButtonDisabled = false // Etat du bouton (activé ou désactivé)
    let firstLoad = true // Indicateur du premier chargement de la page
    let choice = 0 // Choix de l'utilisateur (1 = hausse, 2 = baisse)
    let score = 0 // Score de l'utilisateur
    let textPopUp = [ // Texte à afficher dans la pop-up en fonction du résultat
        '📈 Well played ! The price was higher',
        '📉 Well played ! The price was lower',
        '🚫 Not this time ! Try again',
        '⏳ The price has not yet been updated'
    ]
    const scoreElement = document.getElementById('score')
    const priceElement = document.getElementById('price')
    const popUpElement = document.getElementById('popUp')
    const timerDiv = document.querySelector('.timer')
    const infosContainer = document.querySelector('.infos-container')

    // Affichage du score
    scoreElement.innerHTML = `Score: ${score}`

    // Ajout des événements sur les boutons
    document.getElementById('UpButton').addEventListener('click', () => setChoice(1))
    document.getElementById('DownButton').addEventListener('click', () => setChoice(2))
    document.getElementById('infos').addEventListener('click', toggleInfosContainer)

    // Fonction pour récupérer le prix du Bitcoin
    function handleButtonClick() {
        // Si le bouton n'est pas désactivé, 
        // on récupère le prix du Bitcoin et le bouton se réactive apres 10 secondes
        if (!isButtonDisabled) {
            isButtonDisabled = true
            getBitcoinPrice()
            setTimeout(() => {
                isButtonDisabled = false
            }, 5000)
        }
    }

    // Fonction pour récupérer le prix du Bitcoin depuis l'API
    function fetchBitcoinPrice() {
        const apiUrl = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD'
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const bitcoinPrice = parseFloat(data.USD).toFixed(2) // Récupération du prix du Bitcoin
                previousBitcoinPrice = lastBitcoinPrice // Mise à jour du prix précédent
                lastBitcoinPrice = bitcoinPrice // Mise à jour du dernier prix
                priceElement.innerHTML = `${bitcoinPrice}` // Affichage du prix du Bitcoin

                // Si ce n'est pas le premier chargement de la page, 
                // on ajoute une classe pour indiquer si le prix a augmenté ou diminué
                if (!firstLoad) {
                    if (lastBitcoinPrice > previousBitcoinPrice) {
                        priceElement.classList.add('green')
                    } else if (lastBitcoinPrice < previousBitcoinPrice) {
                        priceElement.classList.add('red')
                    }
        
                    setTimeout(() => { // Suppression de la classe après 1,2 secondes
                        priceElement.classList.remove('green', 'red')
                    }, 1200)
                } else {
                    firstLoad = false
                }
                
                // Si l'utilisateur a fait un choix, on vérifie le prix
                if (choice !== 0) {
                    checkPrice()
                }
                choice = 0 // Réinitialisation du choix de l'utilisateur
            })
            .catch(error => { // En cas d'erreur lors de l'appel à l'API, on affiche un message d'erreur
                console.error('Erreur lors de la récupération du prix du Bitcoin :', error)
                priceElement.innerHTML = 'Erreur lors de la récupération du prix.'
            })
    }

    // Fonction pour afficher le prix du Bitcoin et lancer un compte à rebours
    function getBitcoinPrice() {
        priceElement.innerHTML = `${lastBitcoinPrice}` // Affichage du prix
        let countdown = 5 // Initialisation du compte à rebours
        timerDiv.innerHTML = `Timer: ${countdown} ` // Affichage du compte à rebours

        // Lancement du compte à rebours
        const countdownInterval = setInterval(() => {
            countdown--
            timerDiv.innerHTML = `Timer: ${countdown}`

            // Si le compte à rebours est terminé alors on récupère le prix du Bitcoin
            if (countdown === 0) { 
                clearInterval(countdownInterval)
                fetchBitcoinPrice()
            }
        }, 1000)
    }

    // Fonction pour vérifier le score de l'utilisateur
    function checkPrice() {
        let winCondition = (choice === 1 && lastBitcoinPrice > previousBitcoinPrice) || (choice === 2 && lastBitcoinPrice < previousBitcoinPrice)
        let loseCondition = (choice === 1 && lastBitcoinPrice < previousBitcoinPrice) || (choice === 2 && lastBitcoinPrice > previousBitcoinPrice)

        if (winCondition) {
            score++
            popUpElement.innerHTML = textPopUp[choice - 1]
        } else if (loseCondition) {
            if (score > 0) {
                score--
            }
            popUpElement.innerHTML = textPopUp[2]
        } else {
            popUpElement.innerHTML = textPopUp[3]
        }
        popUpElement.style.animation = "popUpAnimation 0.5s ease forwards"
        scoreElement.innerHTML = `Score: ${score}`
    }

    // Fonction pour définir le choix de l'utilisateur
    function setChoice(value) {
        choice = value
        if (popUpElement.innerHTML.trim() !== '') {
            popUpElement.style.animation = "popUpAnimationHide 0.5s ease forwards"
        }
        handleButtonClick()
    }

    // Fonction pour afficher ou cacher le conteneur d'informations
    function toggleInfosContainer() {
        if (infosContainer.classList.contains('show')) {
            infosContainer.classList.add('hide')
            infosContainer.classList.remove('show')
        } else {
            infosContainer.classList.remove('hide')
            infosContainer.classList.add('show')
        }
    }
})