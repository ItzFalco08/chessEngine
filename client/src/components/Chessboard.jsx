"use client"
import { useState, useCallback } from 'react'
import { Chess } from 'chess.js'

const Chessboard = () => {
    // Initialize the chess game
    const [game] = useState(() => new Chess())
    const [rightClickedSquares, setRightClickedSquares] = useState({})
    const [rightClickStartIndex, setRightClickStartIndex] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    

    // Safely get the board state
    const board = game?.board() || []

    // Define square colors
    const DARK_SQUARE = "#7c9eb2"
    const LIGHT_SQUARE = "#d9e4e8"
    const SELECTED_DARK_SQUARE = "#d36c63"
    const SELECTED_LIGHT_SQUARE = "#e77b6e"

    // Handle mouse down (grab piece)
    function onMouseDown(e) {
        if (e.button === 0) {
            e.target.style.cursor = 'grabbing'
        }
    }

    // Handle mouse up (release piece)
    function onMouseUp(e) {
        e.target.style.cursor = 'grab'
    }

    // Prevent context menu on right-click
    function handleContextMenu(e) {
        e.preventDefault()
    }

    // Handle right-click to highlight squares
    function handleMouseUp(e, index) {
        if (e.button === 2) setIsDragging(false)
        if (e.button === 2 && index === rightClickStartIndex) {
            setRightClickedSquares((prev) => ({
                ...prev,
                [index]: !prev[index]
            }))
        }
    }

    // Clear highlighted squares on left-click
    function removeClickedSquares(e, index) {
        if (e.button === 0) {
            setRightClickedSquares({}) // Reset to empty object
        } else if (e.button === 2) {
            setIsDragging(true)
            setRightClickStartIndex(index)
            console.log('index set to: ', index)
        }
    }

    const handleMouseMove = useCallback(
        (index) => {
            if (isDragging) {
                console.log('start to end: ', rightClickStartIndex, index)
                // store arrow to an array and draw them
            }
        },
        [isDragging],
    )



    return (
        <div className='relative grid grid-cols-8 h-[320px] w-[320px] md:h-[480px] md:w-[480px] xl:w-[600px] xl:h-[600px] bg-white'>
            {board.flat().map((square, index) => {
                // Skip rendering if square is null or undefined

                // Calculate row and column for color logic
                const row = Math.floor(index / 8)
                const col = index % 8
                const isDark = (row + col) % 2 !== 0
                const isRightClicked = !!rightClickedSquares[index]

                // Determine square color
                const SQUARE_COLOR = isRightClicked
                    ? (isDark ? SELECTED_DARK_SQUARE : SELECTED_LIGHT_SQUARE)
                    : (isDark ? DARK_SQUARE : LIGHT_SQUARE)

                // Get piece type (e.g., "wp" for white pawn)
                const PIECE = square ? square.color + square.type : false

                return (
                    <div
                        key={index}
                        className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] xl:w-[75px] xl:h-[75px]'
                        style={{ backgroundColor: SQUARE_COLOR }}
                        onContextMenu={(e) => handleContextMenu(e)}
                        onMouseUp={(e) => handleMouseUp(e, index)}
                        onMouseDown={(e) => removeClickedSquares(e, index)}
                        onMouseMove={() => handleMouseMove(index)}
                    >
                        {PIECE && (
                            <img
                                draggable={false}
                                onMouseDown={onMouseDown}
                                onMouseUp={onMouseUp}
                                className='w-full h-full cursor-grab'
                                src={`/${PIECE}.png`} // Ensure images are in the public folder
                                onError={(e) => {
                                    // Hide broken images
                                    e.target.style.display = 'none'
                                }}
                                alt={`idk`} // Accessibility
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Chessboard