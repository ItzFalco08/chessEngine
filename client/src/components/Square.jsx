"use client"

export default function Square({
    index,
    square,
    handleClick,
    selectedPiece,
    validMoves,
    getCords,
    isDark
}) {
    const squareCord = getCords(index);
    const isValidMove = validMoves.includes(squareCord);
    const isSelected = selectedPiece === square?.square;
    const isCaptureMove = isValidMove && square; // Check if move is a capture

    return (
        <div
            onClick={()=> handleClick(isValidMove, square, squareCord)}
            className={`
                w-[75px] h-[75px] flex justify-center items-center
                ${isDark(index) ? "bg-[#7c9eb2]" : "bg-[#d9e4e8]"}
                ${isSelected && "!bg-[#69b8d0]"}
                ${isValidMove && "hover:bg-[#669ebec8] cursor-pointer"}
            `}
        >

            {square && (
                <img
                    style={{ userSelect: 'none' }}
                    draggable={false}
                    src={`/${square.color}${square.type}.png`}
                    className="w-full h-full cursor-grab"
                    alt={`${square.color} ${square.type}`}
                />
            )}

            {/* Move indicator dots - rendered first but positioned absolutely */}
            {isValidMove && !square && (
                <div className="absolute w-4 h-4 rounded-full bg-[#4f7b94c8] z-10" />
            )}

            {/* Capture indicator - circle around the piece */}
            {isCaptureMove && (
                <div className="absolute w-[68px] h-[68px] rounded-full border-4 border-[#4f7b94c8] z-0" />
            )}

        </div>
    );
}