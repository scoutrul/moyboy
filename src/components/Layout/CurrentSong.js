import React from 'react';

const CurrentSong = ({ artistName, songName, textChords, songPath, songKey }, onEditSong, onDeleteSong) => (
    <div>
        <h1>{ artistName }</h1>
        <button onClick={() => onEditSong({ artistName, songName, textChords })}>Edit</button>
        <button onClick={() => onDeleteSong({ songPath, songKey })}>Delete</button>
        <blockquote>
            <div key={songName}>
                <h2>{songName}</h2>
                <blockquote>
                <pre>{ textChords }</pre>
                </blockquote>
            </div>
        </blockquote>
    </div>
);

export default CurrentSong;