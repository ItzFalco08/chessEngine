"use client"
import { useEffect, useMemo, useState, useRef } from "react";
import { Chess } from "chess.js"
import Square from "./Square";

export default function Chessboard() {
    const [fen, setFen] = useState(() => new Chess().fen());
    const game = useMemo(() => new Chess(fen), [fen]);
    const board = useMemo(() => game.board().flat() || [], [fen]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_BACKEND_WS_URL);
    
      return () => {
        second
      }
    }, [third])
    
    
    // Audio refs
    const gameStartAudio = useRef(null);
    const moveAudio = useRef(null);
    const captureAudio = useRef(null);
    const promoteAudio = useRef(null);
    const castleAudio = useRef(null);
    const checkAudio = useRef(null);

    const rowToNumber = useRef({
        0: "8", 1: "7", 2: "6", 3: "5",
        4: "4", 5: "3", 6: "2", 7: "1"
    });

    const colToLetter = useRef({
        0: "a", 1: "b", 2: "c", 3: "d",
        4: "e", 5: "f", 6: "g", 7: "h"
    });

    useEffect(() => {
        // Initialize audio
        gameStartAudio.current = new Audio("/audio/game-start.webm");
        moveAudio.current = new Audio("/audio/move.mp3");
        captureAudio.current = new Audio("/audio/capture.mp3");
        promoteAudio.current = new Audio("/audio/promote.webm");
        castleAudio.current = new Audio("/audio/castle.webm");
        checkAudio.current = new Audio("/audio/move-check.webm");

        gameStartAudio.current.play();
    }, []);

    function selectPiece(square) {
        if (!square) return;
        
        setSelectedPiece(square);
        const moves = game.moves({
            square: square,
            verbose: true
        });
        setValidMoves(moves.map(move => move.to));
    }

    function getCords(index) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        return `${colToLetter.current[col]}${rowToNumber.current[row]}`;
    }

    function isDark(index) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        return (row + col) % 2 !== 0;
    }

    function movePiece(fromSquare, toSquare) {
        try {
            const move = game.move({
                from: fromSquare,
                to: toSquare,
                promotion: 'q'
            });
            
            if (!move) return;
            
            setFen(game.fen());
            setValidMoves([]);
            setSelectedPiece(null);

            // Play appropriate sound
            if (game.isCheck()) {
                checkAudio.current?.play();
            } else if (move.captured) {
                captureAudio.current?.play();
            } else if (move.flags.includes('k') || move.flags.includes('q')) {  // kingside or queenside castle
                castleAudio.current?.play();
            } else if (move.promotion) {
                promoteAudio.current?.play();
            } else {
                moveAudio.current?.play();
            }
        } catch (error) {
            console.error("Move error:", error);
        }
    }

    const handleClick = (isValidMove, square, squareCord) => {
        if (isValidMove) {
            movePiece(selectedPiece, squareCord);
        } else if(!square) {
            // If the square is empty and not a valid move, reset the selected piece
            if (selectedPiece) {
                setSelectedPiece(null);
                setValidMoves([]);
            }
        }
        else{
            selectPiece(square?.square);
        }
    };


    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            className="w-[600px] h-[600px] relative flex flex-wrap"
        >
            {board.map((square, index) => (
                <Square
                    key={index}
                    index={index}
                    square={square}
                    selectedPiece={selectedPiece}
                    validMoves={validMoves}
                    getCords={getCords}
                    isDark={isDark}
                    handleClick={handleClick}
                />
            ))}
        </div>
    )
}