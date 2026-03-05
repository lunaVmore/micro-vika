import React from 'react'
import './MainMenu.css'

const MainMenu = ({ characters, onSelectCharacter }) => {
  return (
    <div className="main-menu">
      <h1 className="logo">Micro-Vika</h1>
      <div className="characters-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => onSelectCharacter(character)}
          >
            <div className="character-preview">
              <img src={character.image} alt={character.name} />
            </div>
            <h3>{character.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainMenu
