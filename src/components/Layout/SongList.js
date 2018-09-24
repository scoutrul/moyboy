import React from 'react';
import { Menu } from 'antd';
import { map } from 'lodash';

const SongList = (data, onShowSong) => map(data, (artists, artistName) => {
    return (
        <Menu theme="dark" mode="inline" key={artistName}>
        { 
            map(artists, (songKey, songName) => (
                <Menu.Item key={songName}>
                    <a className="nav-text" href={`#${songName}`} onClick={() => onShowSong(artistName, songName, songKey)}>{ artistName } - { songName }</a>
                </Menu.Item>
            ))  
        }
        </Menu>
    )
});

export default SongList;