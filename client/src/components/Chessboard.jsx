"use client"
import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Chess } from 'chess.js'

const DARK_SQUARE = "#7c9eb2" 
const LIGHT_SQUARE = "#d9e4e8"
const SELECTED_DARK_SQUARE = "#d36c63"
const SELECTED_LIGHT_SQUARE = "#e77b6e"

const Chessboard = () => {
    const [game] = useState(() => new Chess())
    const [highlightedSquares, setHighlightedSquares] = useState({})
    const [dragStartIndex, setDragStartIndex] = useState(null)
    const [isRightDragging, setIsRightDragging] = useState(false)
    const lastHoveredIndex = useRef(null)
    // Container ref for board sizing
    const boardContainerRef = useRef(null)
    const [squareWidth, setSquareWidth] = useState(0)

    const [arrows, setArrows] = useState([])
    const [temporaryArrow, setTemporaryArrow] = useState(null)

    const [draggedPieceIndex, setDraggedPieceIndex] = useState(null)

    


    // Use ResizeObserver to update squareWidth dynamically.
    useEffect(() => {
        if (!boardContainerRef.current) return
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const width = entries[0].contentRect.width / 8
                setSquareWidth(width)
            }
        })
        observer.observe(boardContainerRef.current)
        return () => observer.disconnect()
    }, [])

    // Memoized board data (flattening nested arrays)
    const board = useMemo(() => game.board().flat() || [], [game])


    const handleRightClickStart = useCallback((index) => {
        setIsRightDragging(true)
        setDragStartIndex(index)
        lastHoveredIndex.current = null
    }, [])

    const handleLeftClick = useCallback(() => {
        setHighlightedSquares({})
        setArrows([])
    }, [])

    const handleRightClickEnd = useCallback((index) => {
        setIsRightDragging(false)
        if (index === dragStartIndex) {
            setHighlightedSquares(prev => ({
                ...prev,
                [index]: !prev[index]
            }))
        } else if (temporaryArrow) {
            setArrows(prev => [...prev, temporaryArrow])
        }
        setTemporaryArrow(null)
    }, [dragStartIndex, temporaryArrow])

    const getCords = useCallback((index) => {
        const row = Math.floor(index / 8)
        const col = index % 8
        return {
            x: squareWidth * col + squareWidth / 2,
            y: squareWidth * row + squareWidth / 2
        }
    }, [squareWidth])

    const handleArrowDrag = useCallback((index) => {
        if (isRightDragging && lastHoveredIndex.current !== index && index !== dragStartIndex) {
            lastHoveredIndex.current = index
            const dragStartCords = getCords(dragStartIndex)
            const dragEndCords = getCords(index)
            setTemporaryArrow({
                x1: dragStartCords.x,
                y1: dragStartCords.y,
                x2: dragEndCords.x,
                y2: dragEndCords.y,
            })
        }
    }, [isRightDragging, dragStartIndex, getCords])

    function MoveMouseDown(e) {
    }


    return (
        <div
            ref={boardContainerRef}
            className="relative grid grid-cols-8 w-[320px] h-[320px] md:w-[480px] md:h-[480px] xl:w-[600px] xl:h-[600px] bg-white"
        >
            {/* Render SVG arrows */}
            <svg className="absolute z-[100] pointer-events-none" width="600" height="600">
                <defs>
                    <marker
                        id="arrowhead"
                        refX="15"
                        refY="20"
                        markerWidth="30"
                        markerHeight="40"
                        markerUnits="userSpaceOnUse"
                        orient="auto"
                    >
                        <path d="M 0 0 L 30 20 L 0 40 Z" fill="green" />
                    </marker>
                </defs>
                {arrows.map((arrow, index) => (
                    <line
                        key={index}
                        x1={arrow.x1}
                        y1={arrow.y1}
                        x2={arrow.x2}
                        y2={arrow.y2}
                        opacity="0.6"
                        stroke="green"
                        strokeWidth="8"
                        markerEnd="url(#arrowhead)"
                    />
                ))}
                {temporaryArrow && (
                    <line
                        x1={temporaryArrow.x1}
                        y1={temporaryArrow.y1}
                        x2={temporaryArrow.x2}
                        y2={temporaryArrow.y2}
                        opacity="0.6"
                        stroke="green"
                        strokeWidth="8"
                        markerEnd="url(#arrowhead)"
                    />
                )}
            </svg>

            {/* Render board squares */}
            {board.map((square, index) => {
                // Determine square color based on default pattern
                const isDark = ((Math.floor(index / 8) + (index % 8)) % 2 !== 0)
                const bgColor = highlightedSquares[index]
                    ? (isDark ? SELECTED_DARK_SQUARE : SELECTED_LIGHT_SQUARE)
                    : (isDark ? DARK_SQUARE : LIGHT_SQUARE)
                return (
                    <div
                        key={index}
                        onContextMenu={(e) => e.preventDefault()}
                        onClick={handleLeftClick}
                        onMouseDown={(e) => {
                            if (e.button === 2) handleRightClickStart(index)
                        }}
                        onMouseUp={(e) => {
                            if (e.button === 2) handleRightClickEnd(index)
                        }}
                        onMouseMove={() => handleArrowDrag(index)}
                        className=" flex justify-center items-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] xl:w-[75px] xl:h-[75px]"
                        style={{ backgroundColor: bgColor }}
                    >
                        {/* Render chess piece image if available */}
                        {square && (
                            <img
                                draggable={false}
                                className="cursor-grab active:cursor-grabbing"
                                width={squareWidth}
                                height={squareWidth}
                                src={`/${square.color}${square.type}.png`}
                                alt={`${square.color} ${square.type}`}
                                loading="lazy"
                                onMouseDown={(e)=> MoveMouseDown(e, index)}
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Chessboard