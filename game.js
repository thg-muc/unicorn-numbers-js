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
      collectUnicorns: 'Collect Unicorns!',
      startGame: 'Start Game',
      scoreText: (count, percentage) =>
        `You earned ${count} stars! (${percentage}%)`,
    },
    rewardsScreen: {
      title: '🦄 Collection',
      chooseUnicorn: (unlocked, total) =>
        `Tap to unlock (${unlocked}/${total} collected)`,
      chooseStarterUnicorn: 'Choose your starter unicorn!',
      allUnlocked: 'Amazing! You collected all unicorns!',
      startGame: 'Start Game',
      tapToView: 'Tap to view',
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
      collectUnicorns: 'Einhörner sammeln!',
      startGame: 'Spiel starten',
      scoreText: (count, percentage) =>
        `Du hast ${count} Sterne verdient! (${percentage}%)`,
    },
    rewardsScreen: {
      title: '🦄 Sammlung',
      chooseUnicorn: (unlocked, total) =>
        `Tippen zum Freischalten (${unlocked}/${total} gesammelt)`,
      chooseStarterUnicorn: 'Wähle dein Starter-Einhorn!',
      allUnlocked: 'Fantastisch! Du hast alle Einhörner gesammelt!',
      startGame: 'Spiel starten',
      tapToView: 'Tippen zum Anzeigen',
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

  playUnicornsAudio() {
    // Play unicorns audio for rewards screen
    const audioPath = `assets/audio/${this.language}/unicorns.mp3`
    this.introAudio = new Audio(audioPath)

    this.introAudio.onerror = () => {
      console.warn(`Could not load unicorns audio: ${audioPath}`)
    }

    this.introAudio.play().catch(error => {
      console.warn('Could not play unicorns audio:', error)
    })
  }
}

// Sound Effects Manager for UI sounds
class SoundEffects {
  constructor() {
    this.effects = {}
    this.loadEffects()
  }

  loadEffects() {
    const effectNames = [
      'correct-answer',
      'wrong-answer',
      'transition',
      'game-complete',
    ]

    effectNames.forEach(name => {
      this.effects[name] = new Audio(`assets/audio/effects/${name}.mp3`)
      this.effects[name].preload = 'auto'

      // Handle loading errors gracefully
      this.effects[name].onerror = () => {
        console.warn(`Could not load sound effect: ${name}.mp3`)
      }
    })
  }

  play(effectName) {
    if (this.effects[effectName]) {
      try {
        // Clone audio for overlapping sounds (important for rapid clicks)
        const audio = this.effects[effectName].cloneNode()
        audio.play().catch(error => {
          console.warn(`Could not play sound effect: ${effectName}`, error)
        })
      } catch (error) {
        console.warn(`Error playing sound effect: ${effectName}`, error)
      }
    }
  }

  playCorrectAnswer() {
    this.play('correct-answer')
  }

  playWrongAnswer() {
    this.play('wrong-answer')
  }

  playTransition() {
    this.play('transition')
  }

  playGameComplete() {
    this.play('game-complete')
  }

  playRewardUnlock() {
    // Use game complete sound for reward unlock
    this.play('game-complete')
  }
}

// Rewards system for unicorn collection
class RewardsManager {
  constructor() {
    this.unicornData = []
    this.unlockedIds = new Set()
    this.loadProgress()
    this.initializeUnicorns()
    console.log(`Loaded ${this.unicornData.length} unicorn images`)
  }

  initializeUnicorns() {
    // Simple list of actual unicorn files (no HTTP requests needed!)
    const unicornFiles = [
      '01_luna.jpg',
      '02_stella.jpg',
      '03_aurora.jpg',
      '04_nova.jpg',
      '05_ginger.jpg',
      '06_sunny.jpg',
      '07_pixie.jpg',
      '08_rainbow.jpg',
      '09_snowflake.jpg',
      '10_starlight.jpg',
      '11_donna.jpg',
      '12_sparkle.jpg',
      '13_dreamy.jpg',
      '14_magic.jpg',
      '15_elsa.jpg',
    ]

    this.unicornData = unicornFiles.map(filename => {
      const parts = filename.split('_')
      const id = parseInt(parts[0])
      const nameWithExt = parts[1]
      const name = nameWithExt.split('.')[0]

      return {
        id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        filename,
        path: `assets/rewards/${filename}`,
        isUnlocked: this.unlockedIds.has(id),
      }
    })
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('unicornRewards')
      if (saved) {
        const progress = JSON.parse(saved)
        this.unlockedIds = new Set(progress.unlockedIds || [])
      }
    } catch (error) {
      console.warn('Could not load rewards progress:', error)
      this.unlockedIds = new Set()
    }
  }

  saveProgress() {
    try {
      const progress = {
        unlockedIds: Array.from(this.unlockedIds),
        totalUnlocked: this.unlockedIds.size,
        lastUnlock: new Date().toISOString(),
      }
      localStorage.setItem('unicornRewards', JSON.stringify(progress))
    } catch (error) {
      console.warn('Could not save rewards progress:', error)
    }
  }

  getRandomLockedUnicorn() {
    const locked = this.unicornData.filter(unicorn => !unicorn.isUnlocked)
    if (locked.length === 0) return null

    const randomIndex = Math.floor(Math.random() * locked.length)
    return locked[randomIndex]
  }

  unlockUnicorn(id) {
    this.unlockedIds.add(id)
    const unicorn = this.unicornData.find(u => u.id === id)
    if (unicorn) {
      unicorn.isUnlocked = true
    }
    this.saveProgress()
    return unicorn
  }

  getAllUnicorns() {
    return this.unicornData
  }

  getUnlockedCount() {
    return this.unlockedIds.size
  }

  getTotalCount() {
    return this.unicornData.length
  }

  isAllUnlocked() {
    return this.unlockedIds.size >= this.unicornData.length
  }

  canUnlockMore() {
    return this.unlockedIds.size < this.unicornData.length
  }
}

// Game state management
class GameSession {
  constructor() {
    this.currentRound = 0
    this.difficulty = 'Easy'
    this.totalRounds = this.difficulty === 'Easy' ? 2 : 10
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
    if (percentage === 0) return ''
    if (percentage > 80) return '⭐⭐⭐⭐⭐'
    if (percentage > 60) return '⭐⭐⭐⭐'
    if (percentage > 40) return '⭐⭐⭐'
    if (percentage > 20) return '⭐⭐'
    return '⭐'
  }
}

// Game controller
class GameController {
  constructor() {
    this.gameSession = null
    this.audioManager = new AudioManager()
    this.soundEffects = new SoundEffects()
    this.rewardsManager = new RewardsManager()
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document
      .getElementById('restart-button')
      .addEventListener('click', () => this.handleSeeUnicornsClick())

    // Language selection plays audio and shows intro screen
    document
      .getElementById('lang-en')
      .addEventListener('click', () => this.selectLanguage('en'))
    document
      .getElementById('lang-de')
      .addEventListener('click', () => this.selectLanguage('de'))

    // Entire intro screen starts the actual game (not just the button)
    document
      .getElementById('intro-screen')
      .addEventListener('click', () => this.startGame())

    // Rewards screen continue button
    document
      .getElementById('rewards-continue-button')
      .addEventListener('click', () => this.continueFromRewards())

    // Modal close on click
    document.getElementById('unicorn-modal').addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        this.closeUnicornModal()
      }
    })

    // Modal close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('unicorn-modal')
        if (modal.classList.contains('active')) {
          this.closeUnicornModal()
        }
      }
    })
  }

  startGameWithLanguage(language) {
    this.audioManager.setLanguage(language)
    this.startGame()
  }

  handleSeeUnicornsClick() {
    // Check if player earned any unicorns this game
    const unicornCount = [...this.gameSession.getUnicornReward()].length

    if (unicornCount > 0 && this.rewardsManager.canUnlockMore()) {
      // Player earned unicorns and can unlock more - show rewards screen
      this.showRewardsScreen()
    } else {
      // No unicorns earned or all unlocked - start new game
      this.startGame()
    }
  }

  selectLanguage(language) {
    // Set language
    this.audioManager.setLanguage(language)

    // Check if player has no unicorns - offer starter unicorn
    if (this.rewardsManager.getUnlockedCount() === 0) {
      // First time player - show rewards screen for starter unicorn
      this.isStarterUnicornMode = true
      this.showRewardsScreen()
    } else {
      // Existing player - show intro screen
      this.showIntroScreen()
    }
  }

  startGame() {
    // Play transition sound
    this.soundEffects.playTransition()

    // Stop intro audio to prevent overlap
    this.audioManager.stopIntroAudio()

    this.gameSession = new GameSession()

    // Check what screen we're transitioning from
    const endScreen = document.getElementById('end-screen')
    const isRestartFromEndScreen = !endScreen.classList.contains('hidden')

    if (isRestartFromEndScreen) {
      // Use normal transition for restart from end screen
      this.startNewRound()
    } else {
      // Use magical transition from intro to first game screen
      this.magicalTransitionToGame()
    }
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
      'text-green-700'
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
      'text-green-700',
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

    // Play correct or wrong answer sound
    if (isCorrect) {
      this.soundEffects.playCorrectAnswer()
    } else {
      this.soundEffects.playWrongAnswer()
    }

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
    }, 300) // Wait for fade-out to complete
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
    }, 300)
  }

  showPresentationScreen() {
    this.fadeToScreen('number-presentation')
  }

  showIntroScreen() {
    this.fadeToScreen('intro-screen')
    // Play intro audio when showing intro screen
    this.audioManager.playIntroAudio()
  }

  showGameScreen() {
    this.fadeToScreen('game-screen')
  }

  magicalTransitionToGame() {
    const introScreen = document.getElementById('intro-screen')
    const body = document.body

    // Add sparkle burst and background pulse effects
    introScreen.classList.add('sparkle-burst', 'active')
    body.classList.add('background-pulse')

    // Start magical exit animation
    introScreen.classList.add('magical-exit')

    // After exit animation, show the next screen with magical entrance
    setTimeout(() => {
      // Hide intro screen
      introScreen.classList.add('hidden')
      introScreen.classList.remove('magical-exit', 'sparkle-burst', 'active')

      // Determine what screen to show next
      if (this.gameSession.isGameComplete()) {
        this.showEndScreen()
        return
      }

      const targetNumber = this.gameSession.getCurrentTargetNumber()
      const rep = this.gameSession.currentRepetition

      // Only show number presentation on first repetition of each round
      if (this.gameSession.currentRepetition === 0) {
        this.showNumberPresentationMagically()
      } else {
        this.showGameScreenMagically()
      }

      // Clean up background pulse
      body.classList.remove('background-pulse')
    }, 1000) // Match the magical-exit animation duration
  }

  showNumberPresentationMagically() {
    const screen = document.getElementById('number-presentation')
    screen.classList.remove('hidden')
    screen.classList.add('magical-entrance')

    // Update display and start the round
    this.updatePresentationDisplay()

    setTimeout(() => {
      screen.classList.remove('magical-entrance')
      // Continue with normal number presentation flow
      this.startNumberPresentationFlow()
    }, 700)
  }

  showGameScreenMagically() {
    const screen = document.getElementById('game-screen')
    screen.classList.remove('hidden')
    screen.classList.add('magical-entrance')

    this.updateRoundDisplay()
    this.generateChoices()

    setTimeout(() => {
      screen.classList.remove('magical-entrance')
    }, 700)
  }

  startNumberPresentationFlow() {
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

  showEndScreen() {
    this.showEndScreenMagically()
  }

  showEndScreenMagically() {
    // Find the current visible screen for magical exit
    const allScreens = [
      'intro-screen',
      'number-presentation',
      'game-screen',
      'end-screen',
    ]
    let currentScreen = null

    allScreens.forEach(screenId => {
      const element = document.getElementById(screenId)
      if (!element.classList.contains('hidden')) {
        currentScreen = element
      }
    })

    if (currentScreen) {
      const body = document.body

      // Add sparkle burst and background pulse effects
      currentScreen.classList.add('sparkle-burst', 'active')
      body.classList.add('background-pulse')

      // Start magical exit animation
      currentScreen.classList.add('magical-exit')

      // After exit animation, show end screen with magical entrance
      setTimeout(() => {
        // Hide current screen
        currentScreen.classList.add('hidden')
        currentScreen.classList.remove(
          'magical-exit',
          'sparkle-burst',
          'active'
        )

        this.showEndScreenWithEntrance()

        // Clean up background pulse
        body.classList.remove('background-pulse')
      }, 1000) // Match the magical-exit animation duration
    } else {
      // Fallback to normal transition if no current screen found
      this.fadeToScreen('end-screen')
      this.displayEndScreenResults()
    }
  }

  showEndScreenWithEntrance() {
    const screen = document.getElementById('end-screen')
    screen.classList.remove('hidden')
    screen.classList.add('magical-entrance')

    // Display results immediately
    this.displayEndScreenResults()

    // Play celebration sound after a short delay
    setTimeout(() => {
      this.soundEffects.playGameComplete()
    }, 500)

    setTimeout(() => {
      screen.classList.remove('magical-entrance')
    }, 700)
  }

  displayEndScreenResults() {
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

    // Update button based on stars earned
    const button = document.getElementById('restart-button')
    if (unicornCount === 0) {
      // 0 stars - show "Start Game" with purple styling
      button.textContent = this.audioManager.getTranslation(
        'endScreen.startGame'
      )
      button.className = 'btn-primary btn-size-normal btn-responsive'
    } else {
      // 1+ stars - show "Collect Unicorns!" with yellow styling
      button.textContent = this.audioManager.getTranslation(
        'endScreen.collectUnicorns'
      )
      button.className = 'btn-secondary btn-size-normal btn-responsive'
    }
  }

  fadeToScreen(targetScreenId) {
    const allScreens = [
      'start-screen',
      'intro-screen',
      'number-presentation',
      'game-screen',
      'end-screen',
      'rewards-screen',
    ]

    // Cancel any pending transition timeouts
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout)
      this.transitionTimeout = null
    }
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout)
      this.cleanupTimeout = null
    }

    // Clean up all animation classes and find visible screens
    const visibleScreens = []
    allScreens.forEach(screenId => {
      const element = document.getElementById(screenId)
      element.classList.remove(
        'fade-out',
        'fade-in',
        'magical-exit',
        'magical-entrance',
        'sparkle-burst',
        'active'
      )
      if (!element.classList.contains('hidden')) {
        visibleScreens.push(screenId)
      }
    })

    // Immediately hide all screens except target to prevent stacking
    allScreens.forEach(screenId => {
      if (screenId !== targetScreenId) {
        document.getElementById(screenId).classList.add('hidden')
      }
    })

    // If we have a visible screen that's not the target, do smooth transition
    const currentScreen = visibleScreens.find(
      screenId => screenId !== targetScreenId
    )

    if (currentScreen) {
      // Re-show the current screen temporarily for smooth fade-out
      const currentElement = document.getElementById(currentScreen)
      currentElement.classList.remove('hidden')
      currentElement.classList.add('fade-out')

      // After fade-out completes, show and fade in target
      this.transitionTimeout = setTimeout(() => {
        currentElement.classList.add('hidden')
        currentElement.classList.remove('fade-out')

        const targetElement = document.getElementById(targetScreenId)
        targetElement.classList.remove('hidden')
        targetElement.classList.add('fade-in')

        // Clean up fade-in class after animation
        this.cleanupTimeout = setTimeout(() => {
          targetElement.classList.remove('fade-in')
          this.cleanupTimeout = null
        }, 300)

        this.transitionTimeout = null
      }, 300)
    } else {
      // No transition needed, just show target screen with fade-in
      const targetElement = document.getElementById(targetScreenId)
      targetElement.classList.remove('hidden')
      targetElement.classList.add('fade-in')

      this.cleanupTimeout = setTimeout(() => {
        targetElement.classList.remove('fade-in')
        this.cleanupTimeout = null
      }, 300)
    }
  }

  // Rewards System Methods
  showRewardsScreen() {
    this.fadeToScreen('rewards-screen')
    this.setupRewardsScreen()
  }

  setupRewardsScreen() {
    // Reset session unlock flag
    this.hasUnlockedThisSession = false

    const instructionElement = document.getElementById('rewards-instruction')

    // Update combined text
    if (this.isStarterUnicornMode) {
      // Show starter unicorn instruction
      instructionElement.textContent = this.audioManager.getTranslation(
        'rewardsScreen.chooseStarterUnicorn'
      )
    } else if (this.rewardsManager.isAllUnlocked()) {
      instructionElement.textContent = this.audioManager.getTranslation(
        'rewardsScreen.allUnlocked'
      )
    } else {
      const combinedText = this.audioManager.getTranslation(
        'rewardsScreen.chooseUnicorn'
      )
      instructionElement.textContent = combinedText(
        this.rewardsManager.getUnlockedCount(),
        this.rewardsManager.getTotalCount()
      )
    }

    // Generate unicorn grid
    this.generateUnicornGrid()

    // Update button text and hide initially
    this.audioManager.updateUILanguage()
    const button = document.getElementById('rewards-continue-button')
    button.classList.add('opacity-0', 'pointer-events-none')

    // Play unicorns audio
    this.audioManager.playUnicornsAudio()
  }

  generateUnicornGrid() {
    const gridElement = document.getElementById('unicorn-grid')
    gridElement.innerHTML = ''

    this.rewardsManager.getAllUnicorns().forEach(unicorn => {
      const cardElement = this.createUnicornCard(unicorn)
      gridElement.appendChild(cardElement)
    })
  }

  createUnicornCard(unicorn) {
    const cardContainer = document.createElement('div')
    cardContainer.className = 'unicorn-card'
    cardContainer.dataset.unicornId = unicorn.id

    const cardFront = document.createElement('div')
    cardFront.className = 'card-front'

    const cardBack = document.createElement('div')
    cardBack.className = 'card-back'

    if (unicorn.isUnlocked) {
      // Show unlocked unicorn
      cardFront.className += ' unlocked-card'
      cardFront.innerHTML = `<img src="${unicorn.path}" alt="${unicorn.name}" onerror="this.style.display='none'"/>`

      const nameLabel = document.createElement('div')
      nameLabel.className = 'card-name card-name-visible'
      nameLabel.textContent = unicorn.name
      cardContainer.appendChild(nameLabel)

      // Add click handler to view full size
      cardContainer.addEventListener('click', () =>
        this.openUnicornModal(unicorn)
      )
    } else {
      // Show mystery card
      cardFront.className += ' mystery-card'
      cardFront.innerHTML = '<div class="mystery-icon">❓</div>'

      // Add click handler to unlock if game allows it
      if (this.canUnlockUnicorn()) {
        cardContainer.addEventListener('click', () =>
          this.unlockUnicorn(unicorn.id, cardContainer)
        )
      }
    }

    cardContainer.appendChild(cardFront)
    cardContainer.appendChild(cardBack)

    return cardContainer
  }

  canUnlockUnicorn() {
    // Can unlock if:
    // 1. Player earned unicorns this game OR is in starter mode
    // 2. There are locked unicorns available
    // 3. Hasn't unlocked this session yet
    const unicornCount = this.gameSession
      ? [...this.gameSession.getUnicornReward()].length
      : 0
    const earnedUnicorns = unicornCount > 0
    const isStarterMode = this.isStarterUnicornMode

    return (
      (earnedUnicorns || isStarterMode) &&
      this.rewardsManager.canUnlockMore() &&
      !this.hasUnlockedThisSession
    )
  }

  unlockUnicorn(unicornId, cardElement) {
    if (!this.canUnlockUnicorn()) return

    // Play celebration sound
    this.soundEffects.playRewardUnlock()

    // Mark as unlocked this session and show button
    this.hasUnlockedThisSession = true
    const button = document.getElementById('rewards-continue-button')
    button.classList.remove('opacity-0', 'pointer-events-none')
    button.classList.add('opacity-100', 'pointer-events-auto')

    // Add flip animation
    cardElement.classList.add('flipping')

    // After flip animation, update card content
    setTimeout(() => {
      const unicorn = this.rewardsManager.unlockUnicorn(unicornId)
      if (unicorn) {
        this.updateCardToUnlocked(cardElement, unicorn)
        this.showUnlockCelebration(cardElement)
        // Auto-zoom on the newly unlocked unicorn after a brief delay
        setTimeout(() => {
          this.openUnicornModal(unicorn)
        }, 800) // Wait for celebration to be visible
      }
    }, 400) // Half of flip duration

    // Update instruction text if all unlocked
    setTimeout(() => {
      if (this.rewardsManager.isAllUnlocked()) {
        const instructionElement = document.getElementById(
          'rewards-instruction'
        )
        instructionElement.textContent = this.audioManager.getTranslation(
          'rewardsScreen.allUnlocked'
        )
      }
      this.updateProgressDisplay()
    }, 1000)
  }

  updateCardToUnlocked(cardElement, unicorn) {
    const cardFront = cardElement.querySelector('.card-front')
    const cardBack = cardElement.querySelector('.card-back')

    // Update back face with unicorn image
    cardBack.className = 'card-back unlocked-card'
    cardBack.innerHTML = `<img src="${unicorn.path}" alt="${unicorn.name}" onerror="this.style.display='none'"/>`

    // After flip animation completes, reset card and show on front
    setTimeout(() => {
      // Remove flipping class and reset transform
      cardElement.classList.remove('flipping')
      cardElement.style.transform = 'rotateY(0deg)'

      // Update front face with unicorn content
      cardFront.className = 'card-front unlocked-card'
      cardFront.innerHTML = `<img src="${unicorn.path}" alt="${unicorn.name}" onerror="this.style.display='none'"/>`

      // Add name label (will now be positioned correctly)
      const nameLabel = document.createElement('div')
      nameLabel.className = 'card-name'
      nameLabel.textContent = unicorn.name
      cardElement.appendChild(nameLabel)

      // Clear any existing click handlers and add new one
      const newCardElement = cardElement.cloneNode(true)
      newCardElement.addEventListener('click', () =>
        this.openUnicornModal(unicorn)
      )
      cardElement.parentNode.replaceChild(newCardElement, cardElement)
    }, 400) // Wait for flip animation to complete
  }

  showUnlockCelebration(cardElement) {
    const celebration = document.createElement('div')
    celebration.className = 'unlock-celebration'
    cardElement.appendChild(celebration)

    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration)
      }
    }, 2000)
  }

  updateProgressDisplay() {
    const progressElement = document.getElementById('collection-progress')
    const progressText = this.audioManager.getTranslation(
      'rewardsScreen.progress'
    )
    progressElement.textContent = progressText(
      this.rewardsManager.getUnlockedCount(),
      this.rewardsManager.getTotalCount()
    )
  }

  openUnicornModal(unicorn) {
    const modal = document.getElementById('unicorn-modal')
    const image = document.getElementById('modal-unicorn-image')
    const name = document.getElementById('modal-unicorn-name')

    image.src = unicorn.path
    image.alt = unicorn.name
    name.textContent = unicorn.name

    modal.classList.add('active')
  }

  closeUnicornModal() {
    const modal = document.getElementById('unicorn-modal')
    modal.classList.remove('active')
  }

  continueFromRewards() {
    // Handle starter mode completion
    if (this.isStarterUnicornMode) {
      // Coming from starter unicorn selection - go to intro screen
      this.isStarterUnicornMode = false
      this.showIntroScreen()
      return
    }

    // Regular mode - check if language is already set in localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage) {
      // Language already set, skip to intro screen
      this.audioManager.setLanguage(savedLanguage)
      this.fadeToScreen('intro-screen')
    } else {
      // No language set, show start screen with language selection
      this.fadeToScreen('start-screen')
      this.showStartScreen()
    }
  }

  showStartScreen() {
    // Reset for new game
  }
}

// Floating Particle System
class ParticleSystem {
  constructor() {
    this.particleContainer = document.getElementById('particles-container')
    this.particleTypes = ['stardust', 'sparkle', 'twinkle']
    this.colors = [
      'rgba(255, 255, 255, 0.8)', // White
      'rgba(255, 215, 0, 0.7)', // Gold
      'rgba(255, 192, 203, 0.6)', // Pink
      'rgba(173, 216, 230, 0.6)', // Light Blue
      'rgba(147, 51, 234, 0.5)', // Purple
    ]
    this.maxParticles = 12
    this.particles = []
    this.isActive = true

    this.init()
  }

  init() {
    // Create initial particles with random timing to avoid clustering
    for (let i = 0; i < this.maxParticles; i++) {
      const randomDelay = this.randomBetween(0, 30000) // Spread across 30 seconds
      setTimeout(() => {
        if (this.isActive) {
          this.createParticle()
        }
      }, randomDelay)
    }
  }

  createParticle() {
    if (!this.isActive) return

    const particle = document.createElement('div')
    particle.className = `floating-particle ${this.getRandomType()}`

    // Random properties - more visible
    const size = this.randomBetween(6, 12)
    const opacity = this.randomBetween(0.6, 0.9)
    const duration = this.randomBetween(25, 35)
    const delay = this.randomBetween(0, 5)
    const startX = this.randomBetween(
      window.innerWidth * 0.2,
      window.innerWidth * 0.8
    )

    // Natural drift values - 10% of screen width for S-curve movement
    const driftX1 = this.randomBetween(
      -window.innerWidth * 0.1,
      window.innerWidth * 0.1
    )
    const driftX2 = this.randomBetween(
      -window.innerWidth * 0.08,
      window.innerWidth * 0.08
    )
    const driftX3 = this.randomBetween(
      -window.innerWidth * 0.1,
      window.innerWidth * 0.1
    )
    const driftX4 = this.randomBetween(
      -window.innerWidth * 0.05,
      window.innerWidth * 0.05
    )

    // Glow properties
    const glowSize = this.randomBetween(4, 8)
    const innerGlow = this.randomBetween(1, 3)

    // Set CSS custom properties
    particle.style.setProperty('--size', `${size}px`)
    particle.style.setProperty('--opacity', opacity)
    particle.style.setProperty('--duration', `${duration}s`)
    particle.style.setProperty('--delay', `${delay}s`)
    particle.style.setProperty('--start-x', `${startX}px`)
    particle.style.setProperty('--drift-x1', `${driftX1}px`)
    particle.style.setProperty('--drift-x2', `${driftX2}px`)
    particle.style.setProperty('--drift-x3', `${driftX3}px`)
    particle.style.setProperty('--drift-x4', `${driftX4}px`)
    particle.style.setProperty('--glow-size', `${glowSize}px`)
    particle.style.setProperty('--inner-glow', `${innerGlow}px`)

    // Position the particle
    particle.style.left = `${startX}px`
    particle.style.top = `${window.innerHeight + 20}px`

    this.particleContainer.appendChild(particle)
    this.particles.push(particle)

    // Schedule particle removal and replacement
    setTimeout(
      () => {
        this.removeParticle(particle)
        // Create a new particle to maintain count
        if (this.isActive) {
          setTimeout(
            () => this.createParticle(),
            this.randomBetween(5000, 15000)
          )
        }
      },
      (duration + delay) * 1000
    )
  }

  removeParticle(particle) {
    const index = this.particles.indexOf(particle)
    if (index > -1) {
      this.particles.splice(index, 1)
    }
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle)
    }
  }

  getRandomType() {
    return this.particleTypes[
      Math.floor(Math.random() * this.particleTypes.length)
    ]
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min
  }

  // Control particle system
  pause() {
    this.isActive = false
  }

  resume() {
    this.isActive = true
    this.init()
  }

  destroy() {
    this.isActive = false
    this.particles.forEach(particle => this.removeParticle(particle))
    this.particles = []
  }
}

// Initialize the game when the page loads
let gameController
let particleSystem
document.addEventListener('DOMContentLoaded', () => {
  gameController = new GameController()
  particleSystem = new ParticleSystem()

  // Register service worker for PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          )

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available, show update notification
                  console.log('New content is available; please refresh.')
                  // Optionally show a user-friendly update notification
                }
              })
            }
          })
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error)
        })
    })
  }

  // Handle install prompt for PWA
  let deferredPrompt
  window.addEventListener('beforeinstallprompt', e => {
    console.log('PWA install prompt available')
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e

    // Optionally show your own install promotion UI here
    // For now, we'll just log it
    console.log('PWA can be installed')
  })

  window.addEventListener('appinstalled', evt => {
    console.log('PWA was installed successfully')
    // Optionally track this event or show a success message
  })
})
