import React from 'react';
import { Layout, Menu } from 'antd';
import { map } from 'lodash';

const MainLayout = ({ currUser, currSong, showAllSongs, signIn, signOut, isEditSongModal, data }) => {
	const { Header, Content, Sider } = Layout;

	const renderSongs = () => map(data, (artists, artistName) => (
		<div key={artistName}>
			<h1>{ artistName }</h1>
			<blockquote>
			{ map(artists, (songKey, songName) => (
				<div key={songName}>
					<h2>{songName}</h2>
					<blockquote>
					<pre>{ map(songKey, (song) => song.textChords || song.text) }</pre>
					</blockquote>
				</div>
				)) }
			</blockquote>
		</div>
	));

	const renderSongList = () => map(data, (artists, artistName) => {
		return (
			<Menu theme="dark" mode="inline">
			{ 
				map(artists, (songKey, songName) => (
				<Menu.Item key={songName}>
					<a className="nav-text" href="#" onClick={() => this.showSong(artistName, songName, songKey)}>{ artistName } - { songName }</a>
				</Menu.Item>
				))  
			}
			</Menu>
		)
	});
	
	const renderCurrSong = ({ artistName, songName, textChords }) => (
		<div>
			<h1>{ artistName }</h1>
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

	const signChange = () => {
		if (currUser) {
			return <button onClick={() => signOut()} disabled={!currUser}>Sing out</button>
		}
		return <button onClick={() => signIn()} disabled={currUser}>Sing in</button>
	}
	
	const showSongs = () => {
		if (currSong) {
			return renderCurrSong(currSong);
		}
		return renderSongs();
	}

	const renderAddButton = () => {
		return currUser && <input type="submit" value="add song" onClick={() => isEditSongModal()}/>
	}

	return (
		<Layout>
			<Layout style={{ marginLeft: 400 }}>
				<Header style={{ background: '#fff', padding: 0 }} />
				
				<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
					{ renderAddButton() }
					{ currSong && <input type="submit" value="show all" onClick={() => showAllSongs()}/>}
					{ showSongs() }
				</Content>
				<Sider 
					width='auto' 
					style={{ 
						overflow: 'auto', 
						height: '100vh', 
						position: 'fixed', 
						left: 0, 
						top: 0,
					}}
				>
				<Content style={{ margin: '24px 16px 0' }}>
					{ signChange() }	
					{ renderSongList() }
				</Content>
				</Sider>
			</Layout>
		</Layout>
	)
}

export default MainLayout;
