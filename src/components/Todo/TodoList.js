import React, { Component } from 'react';
import { Table, Input, Icon } from 'antd';
import { map } from 'lodash';
import { database } from '../../firebase';

const columns = [{
  title: 'Задачи',
  dataIndex: 'title',
  key: 'title',
  render: (text, item) => {
    const showText = item.done ? <strike>{text}</strike> : <span>{text}</span>;
    const control = item.done ? <button><Icon type="check" /></button> : <button><Icon type="clock-circle" /></button>;

    return (
        <div> 
            {showText} {control}
        </div>);
    },
}];

const data = [
    {
        key: '1',
        title: 'Добавить компонент в разметку',
        done: true,
    }, {
        key: '2',
        title: 'Вывести таблицу',
        done: true,
    }, {
        key: '3',
        title: 'Интегрироваться с firebase',
        done: true,
    }, {
        key: '4',
        title: 'Изменение, удаление тасков',
        done: false,
    }
];



class TodoList extends Component{

    state = {
        addValue: 'Новая задача',
        data: null,
    }

    componentDidMount() {
        database.ref('task').on('value', (snapshot) => {
            this.formatData(snapshot.val())
        })
    }

    formatData = (snapshot) => {
        const container = [];
        map(snapshot, (val, key) => {
            container.push({
                key,
                title: val.title,
                done: val.done,
            })
        }); 

        this.setState({ data: container })
    }

    addTask = () => {
        database.ref(`task`).push({ title: this.state.addValue, done: false });
    }
    
    valueChange = (value) => {
        this.setState({
            addValue: value.currentTarget.value,
        })
    }

    render(){
        return(
            <div>
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
                <Table 
                    columns={columns} 
                    dataSource={this.state.data} 
                    pagination={false} 
                />
            </div>
        )
    }
}

export default TodoList;