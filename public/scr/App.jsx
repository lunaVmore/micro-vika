import { useState } from 'react'
import { characters } from './data/characters'
import MainMenu from './components/MainMenu'
import Scene from './components/Scene'
import './App.css'

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [showMenu, setShowMenu] = useState(true)

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character)
    setShowMenu(false)
  }

  const handleBackToMenu = () => {
    setShowMenu(true)
    setSelectedCharacter(null)
  }

  return (
    <div className="app">
      {showMenu ? (
        <MainMenu 
          characters={characters} 
          onSelectCharacter={handleSelectCharacter} 
        />
      ) : (
        <Scene 
          character={selectedCharacter}
          onBack={handleBackToMenu}
          allCharacters={characters}
        />
      )}
    </div>
  )
}

export default App
