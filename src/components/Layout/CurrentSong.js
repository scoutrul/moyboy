import React from 'react';
import { Icon } from 'antd';

const CurrentSong = ({ artistName, songName, textChords, songPath, songKey }, onEditSong, onDeleteSong) => (
    <div>
        <h1>{ artistName }</h1>
        <button onClick={() => onEditSong({ artistName, songName, textChords })}><Icon type="edit" /></button>
        <button onClick={() => onDeleteSong({ songPath, songKey })}><Icon type="close" /></button>
        <blockquote>
            <div>
                <h2>{songName}</h2>
                <blockquote>
                <pre>{ textChords }</pre>
                </blockquote>
            </div>
        </blockquote>
    </div>
);

export default CurrentSong;