import React, { Component } from 'react';
import { Layout } from 'antd';
import styles from './styles.scss';

import AllSongs from './Songs';
import SongList from './SongList';
import CurrentSong from './CurrentSong';

class MainLayout extends Component {

	render() {
		const { 
			Header, 
			Content, 
			Sider
		 } = Layout;
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
	
		const renderSignButton = () => {
			if (currUser) {
				return <button onClick={() => onSignOut()} disabled={!currUser}>Sing out</button>
			}
			return <button onClick={() => onSignIn()} disabled={currUser}>Sing in</button>
		}
		
		const showSongs = () => {
			if (currSong) {
				return CurrentSong(currSong, onEditSong, onDeleteSong );
			}
			return AllSongs(data);
		}
	
		const renderAddButton = () => {
			return currUser && <input type="submit" value="add song" onClick={() => onAddSongModal()}/>
		}
		return (
			<Layout>
				<Layout className={styles.leyoutMargin}>
					<Header className={styles.header} />
					<Content className={styles.content}>
						{ showSongs() }
					</Content>
					<Sider 
						width='auto' 
						className={styles.sider}
					>
						<Content className={styles.content}>
							{ renderSignButton() }	
							{ SongList(data, onShowSong) }
							{ renderAddButton() }
							{ currSong && <input type="submit" value="show all" onClick={() => onShowAllSongs()}/>}
						</Content>
					</Sider>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout;
