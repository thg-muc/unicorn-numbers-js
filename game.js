// Game state management
class GameSession {
  constructor() {
    this.currentRound = 0
    this.difficulty = 'Easy'
    this.totalRounds = this.difficulty === 'Easy' ? 5 : 10
    this.repetitionsPerRound = 3
    this.currentRepetition = 0
    this.score = 0
    this.totalSelections = 0

    // Generate target numbers based on difficulty
    const allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (this.difficulty === 'Easy') {
      // Easy: 5 random numbers
      this.targetNumbers = this.shuffleArray(allNumbers).slice(0, 5)
    } else {
      // Medium/Hard: all 10 numbers
      this.targetNumbers = this.shuffleArray(allNumbers)
    }
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  getCurrentTargetNumber() {
    return this.targetNumbers[this.currentRound]
  }

  isGameComplete() {
    return this.currentRound >= this.totalRounds
  }

  nextRound() {
    this.currentRepetition++
    if (this.currentRepetition >= this.repetitionsPerRound) {
      this.currentRound++
      this.currentRepetition = 0
    }
  }

  recordSelection(isCorrect) {
    this.totalSelections++
    if (isCorrect) {
      this.score++
    }
  }

  getScorePercentage() {
    return this.totalSelections > 0
      ? Math.round((this.score / this.totalSelections) * 100)
      : 0
  }

  getUnicornReward() {
    const percentage = this.getScorePercentage()
    if (percentage >= 80) return '🦄🦄🦄🦄🦄'
    if (percentage >= 60) return '🦄🦄🦄🦄'
    if (percentage >= 40) return '🦄🦄🦄'
    if (percentage >= 20) return '🦄🦄'
    return '🦄'
  }
}

// Game controller
class GameController {
  constructor() {
    this.gameSession = null
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document
      .getElementById('start-button')
      .addEventListener('click', () => this.startGame())
    document
      .getElementById('restart-button')
      .addEventListener('click', () => this.startGame())
  }

  startGame() {
    this.gameSession = new GameSession()
    this.showGameScreen()
    this.startNewRound()
  }

  startNewRound() {
    if (this.gameSession.isGameComplete()) {
      this.showEndScreen()
      return
    }

    const targetNumber = this.gameSession.getCurrentTargetNumber()
    const rep = this.gameSession.currentRepetition
    console.log(
      `Round ${this.gameSession.currentRound + 1}, Rep ${rep + 1}/3, Target: ${targetNumber}`
    )

    // Only show number presentation on first repetition of each round
    if (this.gameSession.currentRepetition === 0) {
      console.log('→ Showing number presentation')
      this.showNumberPresentation()
    } else {
      console.log('→ Going directly to choices (repetition)')
      // Go directly to choices for subsequent repetitions
      this.continueToChoices()
    }
  }

  showNumberPresentation() {
    this.showPresentationScreen()
    this.updatePresentationDisplay()
  }

  continueToChoices() {
    this.showGameScreen()
    this.updateRoundDisplay()
    this.generateChoices()
  }

  updatePresentationDisplay() {
    const roundDisplay = Math.floor(this.gameSession.currentRound) + 1
    document.getElementById('presentation-round-counter').textContent =
      roundDisplay
    document.getElementById('presentation-total-rounds').textContent =
      this.gameSession.totalRounds
    document.getElementById('presented-number').textContent =
      this.gameSession.getCurrentTargetNumber()

    // Reset animation by removing and re-adding the class
    const numberElement = document.getElementById('presented-number')
    numberElement.classList.remove('number-presentation')
    setTimeout(() => {
      numberElement.classList.add('number-presentation')
    }, 10)
  }

  updateRoundDisplay() {
    const roundDisplay = Math.floor(this.gameSession.currentRound) + 1
    document.getElementById('round-counter').textContent = roundDisplay
    document.getElementById('total-rounds').textContent =
      this.gameSession.totalRounds
  }

  generateChoices() {
    const targetNumber = this.gameSession.getCurrentTargetNumber()
    const choices = [targetNumber]

    // Generate distractors based on difficulty
    if (this.gameSession.difficulty === 'Easy') {
      // Easy: 3 total choices (1 number + 2 letters)
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const shuffledLetters = this.gameSession.shuffleArray(letters)

      // Add 2 letter distractors for Easy mode
      for (let i = 0; i < 2 && i < shuffledLetters.length; i++) {
        choices.push(shuffledLetters[i])
      }
    } else if (this.gameSession.difficulty === 'Medium') {
      // Medium: 5 total choices (1 number + 4 number distractors)
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        n => n !== targetNumber
      )
      const shuffledNumbers = this.gameSession.shuffleArray(numbers)

      for (let i = 0; i < 4 && i < shuffledNumbers.length; i++) {
        choices.push(shuffledNumbers[i])
      }
    } else if (this.gameSession.difficulty === 'Hard') {
      // Hard: 7 total choices (1 number + 6 number distractors)
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        n => n !== targetNumber
      )
      const shuffledNumbers = this.gameSession.shuffleArray(numbers)

      for (let i = 0; i < 6 && i < shuffledNumbers.length; i++) {
        choices.push(shuffledNumbers[i])
      }
    }

    // Shuffle choices
    const shuffledChoices = this.gameSession.shuffleArray(choices)
    this.renderChoices(shuffledChoices, targetNumber)
  }

  renderChoices(choices, targetNumber) {
    const choicesContainer = document.getElementById('choices')
    choicesContainer.innerHTML = ''

    // Define varied colors and fonts for visual variety (avoiding red, green, purple, black, white)
    const colors = [
      'bg-blue-500 hover:bg-blue-600',
      'bg-yellow-500 hover:bg-yellow-600',
      'bg-pink-500 hover:bg-pink-600',
      'bg-indigo-500 hover:bg-indigo-600',
      'bg-orange-500 hover:bg-orange-600',
      'bg-teal-500 hover:bg-teal-600',
      'bg-cyan-500 hover:bg-cyan-600',
      'bg-amber-500 hover:bg-amber-600',
      'bg-rose-500 hover:bg-rose-600',
      'bg-sky-500 hover:bg-sky-600',
    ]

    const fonts = [
      'font-inter font-black',
      'font-comic font-bold',
      'font-fredoka font-semibold',
      'font-nunito font-black',
      'font-poppins font-bold',
      'font-inter font-extrabold',
      'font-comic font-bold',
    ]

    // Set grid layout based on number of choices with larger buttons
    if (choices.length === 3) {
      choicesContainer.className = 'grid grid-cols-3 gap-2 max-w-full mx-auto'
    } else if (choices.length === 5) {
      choicesContainer.className =
        'grid grid-cols-3 md:grid-cols-5 gap-2 max-w-full mx-auto'
    } else if (choices.length === 7) {
      choicesContainer.className =
        'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 max-w-full mx-auto'
    } else {
      choicesContainer.className =
        'grid grid-cols-2 md:grid-cols-4 gap-2 max-w-full mx-auto'
    }

    choices.forEach((choice, index) => {
      const button = document.createElement('button')
      button.textContent = choice

      // Apply varied colors and fonts
      const colorClass = colors[index % colors.length]
      const fontClass = fonts[index % fonts.length]

      button.className = `${colorClass} text-white text-6xl md:text-7xl lg:text-8xl w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${fontClass}`
      button.addEventListener('click', () =>
        this.handleChoice(choice, targetNumber)
      )
      choicesContainer.appendChild(button)
    })
  }

  handleChoice(selectedChoice, targetNumber) {
    const isCorrect = selectedChoice === targetNumber
    this.gameSession.recordSelection(isCorrect)

    // Visual feedback
    const buttons = document.querySelectorAll('#choices button')
    buttons.forEach(button => {
      const currentFont =
        button.className.match(/font-\w+/g)?.join(' ') || 'font-bold'

      if (button.textContent == selectedChoice) {
        button.className = isCorrect
          ? `bg-green-500 hover:bg-green-600 text-white text-6xl md:text-7xl lg:text-8xl w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${currentFont}`
          : `bg-red-500 hover:bg-red-600 text-white text-6xl md:text-7xl lg:text-8xl w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${currentFont}`
      } else if (button.textContent == targetNumber && !isCorrect) {
        button.className = `bg-green-300 hover:bg-green-400 text-white text-6xl md:text-7xl lg:text-8xl w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${currentFont}`
      }
    })

    // Disable all buttons temporarily
    buttons.forEach(button => (button.disabled = true))

    // Move to next round after a short delay
    setTimeout(() => {
      this.gameSession.nextRound()
      this.startNewRound()
    }, 1500)
  }

  showPresentationScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('game-screen').classList.add('hidden')
    document.getElementById('end-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.remove('hidden')
  }

  showGameScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.add('hidden')
    document.getElementById('end-screen').classList.add('hidden')
    document.getElementById('game-screen').classList.remove('hidden')
  }

  showEndScreen() {
    document.getElementById('game-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.add('hidden')
    document.getElementById('end-screen').classList.remove('hidden')

    // Display results
    const scorePercentage = this.gameSession.getScorePercentage()
    document.getElementById('score-display').textContent =
      `You got ${this.gameSession.score} out of ${this.gameSession.totalSelections} correct! (${scorePercentage}%)`

    document.getElementById('unicorn-reward').textContent =
      this.gameSession.getUnicornReward()
  }
}

// Initialize the game when the page loads
let gameController
document.addEventListener('DOMContentLoaded', () => {
  gameController = new GameController()
})
