import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { map } from 'lodash';
import styles from './styles.scss';

class MainLayout extends Component {

	render() {
		const { 
			data,
			onAddSongModal, 
			currUser, 
			currSong, 
			onShowSong, 
			onShowAllSongs, 
			onSignIn, 
			onSignOut, 
			onEditSong,
			onDeleteSong
		} = this.props;
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
		
		const renderCurrSong = ({ artistName, songName, textChords, songPath, songKey }) => (
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
	
		const renderSignButton = () => {
			if (currUser) {
				return <button onClick={() => onSignOut()} disabled={!currUser}>Sing out</button>
			}
			return <button onClick={() => onSignIn()} disabled={currUser}>Sing in</button>
		}
		
		const showSongs = () => {
			if (currSong) {
				return renderCurrSong(currSong);
			}
			return renderSongs();
		}
	
		const renderAddButton = () => {
			return currUser && <input type="submit" value="add song" onClick={() => onAddSongModal()}/>
		}
		return (
			<Layout>
				{ this.props.children }
				<Layout className={styles.leyoutMargin}>
					<Header className={styles.header} />
					<Content className={styles.content}>
						{ renderAddButton() }
						{ currSong && <input type="submit" value="show all" onClick={() => onShowAllSongs()}/>}
						{ showSongs() }
					</Content>
					<Sider 
						width='auto' 
						className={styles.sider}
					>
						<Content className={styles.content}>
							{ renderSignButton() }	
							{ renderSongList() }
						</Content>
					</Sider>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout;
