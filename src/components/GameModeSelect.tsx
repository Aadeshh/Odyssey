import React from "react";

interface GameModeSelectProps{
    onSelectMode: (mode: string) => void;
}
export const GameModeSelect:React.FC<GameModeSelectProps> = ({onSelectMode}) =>{
    return(
        <div>
            <button onClick={()=>onSelectMode('TAP')}>Play TAP(Asteroidz)</button>
            <button onClick={()=>onSelectMode('SWIPE')}>Play SWIPE(ArtistDiscovery)</button>
        </div>
    )
}