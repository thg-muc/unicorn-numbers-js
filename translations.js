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
