// Centralized translations for all UI text
const translations = {
  en: {
    startScreen: {
      title: '🦄 Unicorn Numbers',
      subtitle: 'Learn the numbers 0-9!',
      languageButton: '🇬🇧 English',
    },
    introScreen: {
      title: '🦄 Unicorn Numbers',
      subtitle: 'Learn the numbers 0-9!',
      pressToPlay: 'Press to play',
    },
    presentationScreen: {
      round: 'Round',
      of: 'of',
      listen: 'Listen...',
      tapToContinue: 'Tap to continue',
      pleaseWait: 'Please wait...',
    },
    gameScreen: {
      round: 'Round',
      of: 'of',
      instruction: 'Find the right number!',
    },
    endScreen: {
      greatJob: 'Great Job!',
      playAgain: 'Play Again',
      scoreText: (count, percentage) =>
        `You earned ${count} unicorns! (${percentage}%)`,
    },
  },
  de: {
    startScreen: {
      title: '🦄 Einhorn-Zahlen',
      subtitle: 'Lerne die Zahlen 0-9!',
      languageButton: '🇩🇪 Deutsch',
    },
    introScreen: {
      title: '🦄 Einhorn-Zahlen',
      subtitle: 'Lerne die Zahlen 0-9!',
      pressToPlay: 'Zum Spielen tippen',
    },
    presentationScreen: {
      round: 'Runde',
      of: 'von',
      listen: 'Hör zu...',
      tapToContinue: 'Tippe zum Fortfahren',
      pleaseWait: 'Bitte warten...',
    },
    gameScreen: {
      round: 'Runde',
      of: 'von',
      instruction: 'Finde die richtige Zahl!',
    },
    endScreen: {
      greatJob: 'Gut gemacht!',
      playAgain: 'Nochmal spielen',
      scoreText: (count, percentage) =>
        `Du hast ${count} Einhörner verdient! (${percentage}%)`,
    },
  },
}

// Audio Manager for number narration and translations
class AudioManager {
  constructor() {
    this.numberEmojis = {
      0: '🥚',
      1: '🕯️',
      2: '🦢',
      3: '🦋',
      4: '⛵',
      5: '🐍',
      6: '🍒',
      7: '🪃',
      8: '⛄',
      9: '🎈',
    }
    this.currentAudio = null
    this.introAudio = null // For intro audio playback
    this.language = null // Will be set when user chooses language
  }

  setLanguage(language) {
    this.language = language
    // Save language preference for session
    localStorage.setItem('preferredLanguage', language)
    this.updateUILanguage()
  }

  getTranslation(key) {
    const keys = key.split('.')
    let translation = translations[this.language]

    for (const k of keys) {
      translation = translation[k]
      if (!translation) {
        console.warn(`Translation not found for key: ${key}`)
        return key
      }
    }

    return translation
  }

  updateUILanguage() {
    if (!this.language) return

    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n')
      const translation = this.getTranslation(key)

      if (typeof translation === 'string') {
        element.textContent = translation
      }
    })
  }

  playNumberAudio(number) {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio = null
      }

      const audioPath = `assets/audio/${this.language}/${number}.mp3`
      this.currentAudio = new Audio(audioPath)

      this.currentAudio.addEventListener('ended', () => {
        resolve()
      })

      this.currentAudio.addEventListener('error', e => {
        console.warn(`Audio file not found: ${audioPath}`)
        reject(e)
      })

      this.currentAudio.play()
    })
  }

  getEmoji(number) {
    return this.numberEmojis[number] || '❓'
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
  }

  playIntroAudio() {
    // Simple intro audio playback on user interaction
    const audioPath = `assets/audio/${this.language}/intro.mp3`
    this.introAudio = new Audio(audioPath)

    this.introAudio.onerror = () => {
      console.warn(`Could not load intro audio: ${audioPath}`)
    }

    this.introAudio.play().catch(error => {
      console.warn('Could not play intro audio:', error)
    })
  }

  stopIntroAudio() {
    if (this.introAudio) {
      this.introAudio.pause()
      this.introAudio = null
    }
  }
}

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

    // Audio and timing properties
    this.minPresentationTime = 5000 // 5 seconds minimum for Easy mode
    this.presentationStartTime = null
    this.canContinue = false

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
    this.audioManager = new AudioManager()
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document
      .getElementById('restart-button')
      .addEventListener('click', () => this.startGame())

    // Language selection plays audio and shows intro screen
    document
      .getElementById('lang-en')
      .addEventListener('click', () => this.selectLanguage('en'))
    document
      .getElementById('lang-de')
      .addEventListener('click', () => this.selectLanguage('de'))

    // Play button starts the actual game
    document
      .getElementById('play-button')
      .addEventListener('click', () => this.startGame())
  }

  startGameWithLanguage(language) {
    this.audioManager.setLanguage(language)
    this.startGame()
  }

  selectLanguage(language) {
    // Set language and play intro audio
    this.audioManager.setLanguage(language)
    this.audioManager.playIntroAudio()

    // Show intro screen
    this.showIntroScreen()
  }

  startGame() {
    // Stop intro audio to prevent overlap
    this.audioManager.stopIntroAudio()

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

  async showNumberPresentation() {
    this.showPresentationScreen()
    this.updatePresentationDisplay()

    // Record presentation start time and disable continue initially
    this.gameSession.presentationStartTime = Date.now()
    this.gameSession.canContinue = false

    const targetNumber = this.gameSession.getCurrentTargetNumber()
    const emoji = this.audioManager.getEmoji(targetNumber)

    // Update emoji element
    document.getElementById('presented-emoji').textContent = emoji

    // Start playing audio
    try {
      this.audioManager.playNumberAudio(targetNumber)

      // Schedule emoji transition after 3.5 seconds
      setTimeout(() => {
        this.triggerEmojiTransition()
      }, 3500)

      // Enable continue after minimum time (5 seconds for Easy mode)
      setTimeout(() => {
        this.enableContinue()
      }, this.gameSession.minPresentationTime)
    } catch (error) {
      console.warn('Audio playback failed:', error)
      // If audio fails, still show emoji after 3.5 seconds and enable continue after 5
      setTimeout(() => {
        this.triggerEmojiTransition()
      }, 3500)

      setTimeout(() => {
        this.enableContinue()
      }, this.gameSession.minPresentationTime)
    }
  }

  triggerEmojiTransition() {
    const numberElement = document.getElementById('presented-number')
    const emojiElement = document.getElementById('presented-emoji')

    // Start number fade-out
    numberElement.classList.add('number-fade-out')

    // Start emoji fade-in
    emojiElement.classList.remove('emoji-hidden')
    emojiElement.classList.add('emoji-fade-in')
  }

  enableContinue() {
    this.gameSession.canContinue = true
    const instructionElement = document.getElementById(
      'presentation-instruction'
    )
    instructionElement.textContent = this.audioManager.getTranslation(
      'presentationScreen.tapToContinue'
    )
    instructionElement.className = instructionElement.className.replace(
      'text-gray-500',
      'text-green-600'
    )

    // Add subtle pulse animation to indicate ready
    const presentationScreen = document.getElementById('number-presentation')
    presentationScreen.style.cursor = 'pointer'
  }

  continueToChoices() {
    // Check if enough time has passed and continue is enabled
    if (
      !this.gameSession.canContinue &&
      this.gameSession.difficulty === 'Easy'
    ) {
      // Show feedback that they need to wait
      const instructionElement = document.getElementById(
        'presentation-instruction'
      )
      instructionElement.textContent = this.audioManager.getTranslation(
        'presentationScreen.pleaseWait'
      )
      instructionElement.className = instructionElement.className.replace(
        'text-gray-500',
        'text-amber-500'
      )

      setTimeout(() => {
        if (!this.gameSession.canContinue) {
          instructionElement.textContent = this.audioManager.getTranslation(
            'presentationScreen.listen'
          )
          instructionElement.className = instructionElement.className.replace(
            'text-amber-500',
            'text-gray-500'
          )
        }
      }, 1000)
      return
    }

    // Stop any ongoing audio when transitioning (except in future difficulty modes)
    if (this.gameSession.difficulty === 'Easy') {
      this.audioManager.stopCurrentAudio()
    }

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

    const numberElement = document.getElementById('presented-number')
    const emojiElement = document.getElementById('presented-emoji')
    const instructionElement = document.getElementById(
      'presentation-instruction'
    )

    // Set number content while hidden
    numberElement.textContent = this.gameSession.getCurrentTargetNumber()

    // Reset all elements to initial state
    numberElement.className =
      numberElement.className
        .replace('number-presentation', '')
        .replace('number-fade-out', '')
        .trim() + ' number-hidden'

    emojiElement.className =
      emojiElement.className.replace('emoji-fade-in', '').trim() +
      ' emoji-hidden'

    // Reset instruction text
    instructionElement.textContent = this.audioManager.getTranslation(
      'presentationScreen.listen'
    )
    instructionElement.className = instructionElement.className.replace(
      'text-green-600',
      'text-gray-500'
    )

    // Reset presentation screen cursor
    document.getElementById('number-presentation').style.cursor = 'default'

    // Start number animation after brief delay
    setTimeout(() => {
      numberElement.className = numberElement.className.replace(
        'number-hidden',
        'number-presentation'
      )
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
      // Use more letters for better variety
      const letters = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ]
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
      'bg-blue-500 hover:bg-blue-400',
      'bg-yellow-500 hover:bg-yellow-400',
      'bg-teal-500 hover:bg-teal-400',
      'bg-fuchsia-500 hover:bg-fuchsia-400',
      'bg-lime-500 hover:bg-lime-400',
      'bg-orange-500 hover:bg-orange-400',
      'bg-violet-500 hover:bg-violet-400',
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

    // Randomly shuffle colors and fonts for true randomness
    const shuffledColors = this.gameSession.shuffleArray([...colors])
    const shuffledFonts = this.gameSession.shuffleArray([...fonts])

    // Set grid layout based on number of choices with responsive spacing
    if (choices.length === 3) {
      choicesContainer.className =
        'grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-full mx-auto'
    } else if (choices.length === 5) {
      choicesContainer.className =
        'grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-full mx-auto'
    } else if (choices.length === 7) {
      choicesContainer.className =
        'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 lg:gap-8 max-w-full mx-auto'
    } else {
      choicesContainer.className =
        'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-full mx-auto'
    }

    choices.forEach((choice, index) => {
      const button = document.createElement('button')
      button.textContent = choice

      // Apply varied colors and fonts - use shuffled arrays for true randomness
      const colorClass = shuffledColors[index % shuffledColors.length]
      const fontClass = shuffledFonts[index % shuffledFonts.length]

      button.className = `${colorClass} text-white text-[min(12vw,4rem)] md:text-6xl lg:text-7xl w-[min(28vw,8rem)] h-[min(28vw,8rem)] md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${fontClass}`
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
        if (isCorrect) {
          button.className = `bg-green-500 hover:bg-green-600 text-white text-[min(12vw,4rem)] md:text-6xl lg:text-7xl w-[min(28vw,8rem)] h-[min(28vw,8rem)] md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center success-animation sparkle-effect ${currentFont}`
        } else {
          button.className = `bg-red-500 hover:bg-red-600 text-white text-[min(12vw,4rem)] md:text-6xl lg:text-7xl w-[min(28vw,8rem)] h-[min(28vw,8rem)] md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${currentFont}`
        }
      } else if (button.textContent == targetNumber && !isCorrect) {
        button.className = `bg-green-300 hover:bg-green-400 text-white text-[min(12vw,4rem)] md:text-6xl lg:text-7xl w-[min(28vw,8rem)] h-[min(28vw,8rem)] md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-lg tap-target transition-colors duration-200 flex items-center justify-center ${currentFont}`
      }
    })

    // Disable all buttons temporarily
    buttons.forEach(button => (button.disabled = true))

    // Move to next round with smooth transition
    setTimeout(() => {
      this.transitionToNextRound()
    }, 1000) // Reduced from 1500ms to 1000ms to match shorter animation
  }

  transitionToNextRound() {
    const choicesContainer = document.getElementById('choices')

    // Fade out only the choice buttons
    choicesContainer.classList.add('fade-out')

    setTimeout(() => {
      // Move to next round
      this.gameSession.nextRound()

      // Check if we need to show presentation or go directly to choices
      if (this.gameSession.isGameComplete()) {
        this.showEndScreen()
        return
      }

      if (this.gameSession.currentRepetition === 0) {
        // New round - show number presentation
        this.showNumberPresentation()
      } else {
        // Same round, next repetition - show new choices with fade-in
        this.showNewChoicesWithFadeIn()
      }
    }, 200) // Wait for fade-out to complete
  }

  showNewChoicesWithFadeIn() {
    const choicesContainer = document.getElementById('choices')

    // Update round display and generate new choices
    this.updateRoundDisplay()
    this.generateChoices()

    // Remove fade-out and add fade-in to choices only
    choicesContainer.classList.remove('fade-out')
    choicesContainer.classList.add('fade-in')

    // Remove fade-in class after animation completes
    setTimeout(() => {
      choicesContainer.classList.remove('fade-in')
    }, 200)
  }

  showPresentationScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('intro-screen').classList.add('hidden')
    document.getElementById('game-screen').classList.add('hidden')
    document.getElementById('end-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.remove('hidden')
  }

  showIntroScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.add('hidden')
    document.getElementById('game-screen').classList.add('hidden')
    document.getElementById('end-screen').classList.add('hidden')
    document.getElementById('intro-screen').classList.remove('hidden')
  }

  showGameScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('intro-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.add('hidden')
    document.getElementById('end-screen').classList.add('hidden')
    document.getElementById('game-screen').classList.remove('hidden')
  }

  showEndScreen() {
    document.getElementById('start-screen').classList.add('hidden')
    document.getElementById('intro-screen').classList.add('hidden')
    document.getElementById('game-screen').classList.add('hidden')
    document.getElementById('number-presentation').classList.add('hidden')
    document.getElementById('end-screen').classList.remove('hidden')

    // Display results
    const scorePercentage = this.gameSession.getScorePercentage()
    const unicornReward = this.gameSession.getUnicornReward()
    // Count actual unicorn emojis, not string length (emojis are 2 chars each)
    const unicornCount = [...unicornReward].length

    const scoreText = this.audioManager.getTranslation('endScreen.scoreText')
    document.getElementById('score-display').textContent = scoreText(
      unicornCount,
      scorePercentage
    )

    document.getElementById('unicorn-reward').textContent = unicornReward
  }
}

// Initialize the game when the page loads
let gameController
document.addEventListener('DOMContentLoaded', () => {
  gameController = new GameController()
})
