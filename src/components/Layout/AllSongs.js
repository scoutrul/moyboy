import React from 'react';
import { map } from 'lodash';

const AllSongs = (data) => map(data, (artists, artistName) => (
    <div key={artistName}>
        <h1>{ artistName }</h1>
        <blockquote>
        { map(artists, (songKey, songName) => (
            <div key={songName}>
                <h2>{songName}</h2>
                <blockquote>
                <pre>{ map(songKey, (song) => song.textChords) }</pre>
                </blockquote>
            </div>
            )) }
        </blockquote>
    </div>
));

export default AllSongs;