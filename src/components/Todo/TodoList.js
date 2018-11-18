import React, { Component } from 'react';
import { Table, Input, Icon } from 'antd';
import { map, reverse } from 'lodash';
import { database } from '../../firebase';

class TodoList extends Component{
    state = {
        addValue: null,
        data: [],
    }

    componentDidMount() {
       this.getData();
    }

    getData = () => {
        database.ref('task').on('value', (snapshot) => {
            let data = [];
            map(snapshot.val(), (val, key) => {
                data.push({
                    key,
                    title: val.title,
                    done: val.done,
                })
            }); 
    
            this.setState({ data: reverse(data) })
        })
    }

    getColumns = () => {
        return [{
            title: '',
            dataIndex: 'title',
            key: 'title',
            render: (text, item) => {
                const showText = item.done ? <strike>{text}</strike> : <span>{text}</span>;
                const control = item.done ? <button onClick={() => this.checkThis(item, false)}><Icon type="check" /></button> : <button onClick={() => this.checkThis(item, true)}><Icon type="clock-circle" /></button>;
                const del = <button onClick={() => this.removeTask(item)}><Icon type="close" /></button>;
            
                return (
                    <div> 
                        {control} {showText} {del}
                    </div>
                );
            },
      }]
    };

    checkThis = (item, bool) => {
        database.ref(`task/${item.key}`).update({ ...item, done: bool });
    }

    addTask = () => {
        database.ref(`task`).push({ title: this.state.addValue, done: false });
    }

    removeTask = (item) => {
        database.ref(`task/${item.key}`).remove();
    }
    
    valueChange = (value) => {
        this.setState({
            addValue: value.currentTarget.value,
        })
    }

    addTaskForm = () => (
        <Input 
            value={this.state.addValue} 
            onChange={(val) => this.valueChange(val)} 
            addonAfter={
                <button onClick={() => this.addTask()}>
                    <Icon type="plus" />
                </button>
            } 
            placeholder="Новая задача" 
        />
    )

    render(){
        return(
            <div>
                <h2>Задачи</h2>
                {this.addTaskForm()}
                <Table 
                    columns={this.getColumns()} 
                    dataSource={this.state.data} 
                    pagination={false} 
                />
            </div>
        )
    }
}

export default TodoList;