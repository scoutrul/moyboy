import React from 'react';
import { Table, Divider, Tag } from 'antd';

const columns = [{
  title: 'Задачи',
  dataIndex: 'title',
  key: 'title',
  render: (text) => text,
}];

const data = [
    {
        key: '1',
        title: 'Добавить компонент в разметку',
    }, {
        key: '2',
        title: 'Вывести таблицу',
    }, {
        key: '3',
        title: 'Интегрироваться с firebase',
    }, {
        key: '4',
        title: 'Изменение, удаление тасков',
    }
];
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.key === '1', // Column configuration not to be checked
    }),
    hideDefaultSelections: false,
    type: 'checkbox',
    selectedRowKeys: ['1','2']
  };

const TodoList = () => (
    <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        bordered
    />
);

export default TodoList;