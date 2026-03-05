import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import './Scene.css'

const Scene = ({ character, onBack, allCharacters }) => {
  const [currentChar, setCurrentChar] = useState(character)
  const [audioProgress, setAudioProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef(new Audio(currentChar.audio))
  const sunRef = useRef(null)
  
  // Границы движения солнца (по дуге)
  const sunBounds = {
    left: 50,
    right: window.innerWidth - 150,
    top: window.innerHeight - 200,
    bottom: window.innerHeight - 100
  }

  useEffect(() => {
    // Загружаем аудио для выбранного персонажа
    audioRef.current.src = currentChar.audio
    audioRef.current.load()
    
    // Слушаем обновление времени
    const updateProgress = () => {
      if (!isDragging && audioRef.current.duration) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setAudioProgress(progress)
      }
    }
    
    audioRef.current.addEventListener('timeupdate', updateProgress)
    
    return () => {
      audioRef.current.removeEventListener('timeupdate', updateProgress)
    }
  }, [currentChar, isDragging])

  // Переключение на следующего персонажа
  const nextCharacter = () => {
    const currentIndex = allCharacters.findIndex(c => c.id === currentChar.id)
    const nextIndex = (currentIndex + 1) % allCharacters.length
    setCurrentChar(allCharacters[nextIndex])
  }

  // Переключение на предыдущего персонажа
  const prevCharacter = () => {
    const currentIndex = allCharacters.findIndex(c => c.id === currentChar.id)
    const prevIndex = (currentIndex - 1 + allCharacters.length) % allCharacters.length
    setCurrentChar(allCharacters[prevIndex])
  }

  // Обработка свайпа для мобильных
  useEffect(() => {
    let touchStartX = 0
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
    }
    
    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchEndX - touchStartX
      
      if (Math.abs(diff) > 50) { // минимальное расстояние для свайпа
        if (diff > 0) {
          prevCharacter() // свайп вправо
        } else {
          nextCharacter() // свайп влево
        }
      }
    }
    
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentChar])

  // Перемотка аудио при перемещении солнца
  const handleSunDrag = (e, data) => {
    setIsDragging(true)
    
    // Рассчитываем прогресс на основе позиции солнца
    const minX = sunBounds.left
    const maxX = sunBounds.right
    const progress = (data.x - minX) / (maxX - minX)
    
    setAudioProgress(progress * 100)
    
    if (audioRef.current.duration) {
      audioRef.current.currentTime = progress * audioRef.current.duration
    }
  }

  const handleSunStop = () => {
    setIsDragging(false)
    if (audioRef.current.paused) {
      audioRef.current.play()
    }
  }

  // Начальное воспроизведение
  useEffect(() => {
    audioRef.current.play()
    return () => {
      audioRef.current.pause()
    }
  }, [])

  return (
    <div 
      className="scene" 
      style={{ backgroundImage: `url(${currentChar.background})` }}
    >
      {/* Кнопка "Назад в меню" */}
      <button className="back-button" onClick={onBack}>
        ← Назад
      </button>
      
      {/* Кнопки навигации для ПК */}
      <button className="nav-button prev" onClick={prevCharacter}>
        ←
      </button>
      <button className="nav-button next" onClick={nextCharacter}>
        →
      </button>
      
      {/* Персонаж */}
      <div className={`character-wrapper ${currentChar.position}`}>
        <img 
          src={currentChar.image} 
          alt={currentChar.name}
          className="character-image"
        />
      </div>
      
      {/* Солнце (перетаскиваемое) */}
      <Draggable
        axis="x"
        bounds={sunBounds}
        onDrag={handleSunDrag}
        onStop={handleSunStop}
        position={{ x: sunBounds.left + (audioProgress / 100) * (sunBounds.right - sunBounds.left), y: sunBounds.top }}
      >
        <div className="sun" ref={sunRef}>
          <div className="sun-rays"></div>
        </div>
      </Draggable>
      
      {/* Название персонажа */}
      <div className="character-name">
        {currentChar.name}
      </div>
    </div>
  )
}

export default Scene
