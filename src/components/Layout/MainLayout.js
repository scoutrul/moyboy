import React, { Component } from 'react';
import { Layout } from 'antd';
import styles from './styles.scss';

import { AllSongs, SongList, CurrentSong } from './';
import { TodoList } from '../index'
import { Icon } from 'antd';

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
				return <button onClick={() => onSignOut()} disabled={!currUser}><Icon type="lock" /></button>
			}
			return <button onClick={() => onSignIn()} disabled={currUser}><Icon type="user" /></button>
		}
		
		const showSongs = () => {
			if (currSong) {
				return CurrentSong(currSong, onEditSong, onDeleteSong );
			}
			return AllSongs(data);
		}
	
		const renderAddButton = () => {
			return currUser && <button onClick={() => onAddSongModal()}><Icon type="folder-add" /></button>
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
						<Content className={styles.content}>
							<TodoList/>
						</Content>
					</Sider>
				</Layout>
			</Layout>
		)
	}
}

export default MainLayout;
