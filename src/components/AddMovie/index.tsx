import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  TimePicker,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import 'dayjs/locale/zh-cn';

interface Item {
  key: string;
  name: string;
  type: string;
  price: number;
  time: string;
  hall: string;
}

const hallOptions = [
  { label: '1号厅', value: '1' },
  { label: '2号厅', value: '2' },
  { label: '3号厅', value: '3' },
  { label: '4号厅', value: '4' },
  { label: '5号厅', value: '5' },
  { label: '6号厅', value: '6' },
  { label: '7号厅', value: '7' },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: string;
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = () => {
    if (inputType === 'select')
      return <Select options={hallOptions} placeholder="请选择" />;
    if (inputType === 'datePicker')
      return (
        <TimePicker
          locale={locale}
          format={'HH:mm'}
          defaultValue={dayjs('00:00', 'HH:mm')}
        />
      );
    if (inputType === 'number') return <InputNumber></InputNumber>;
    return <Input />;
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AddMovie: React.FC<{
  setFilmValue: any;
  setHallValue: any;
  filmOptions: any;
  originData: any;
  handleAdd: any;
  handleCopy: any;
  handleDelete: any;
  handleSave: any;
}> = ({
  setHallValue,
  setFilmValue,
  filmOptions,
  originData,
  handleAdd,
  handleDelete,
  handleSave,
  handleCopy,
}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
      form.setFieldsValue({ name: '', ...record });
      setEditingKey(record.key);
    };

    const cancel = () => {
      setEditingKey('');
    };

    const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as Item;
        handleSave(key, row);
        setEditingKey('');
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
      {
        title: '影厅',
        dataIndex: 'hall',
        editable: true,
        filters: [
          {
            text: '影厅1',
            value: '1',
          },
          {
            text: '影厅2',
            value: '2',
          },
          {
            text: '影厅3',
            value: '3',
          },
          {
            text: '影厅4',
            value: '4',
          },
          {
            text: '影厅5',
            value: '5',
          },
          {
            text: '影厅6',
            value: '6',
          },
          {
            text: '影厅7',
            value: '7',
          },
        ],
        filterSearch: true,
        onFilter: (value: string, record: any) => {
          setHallValue(value);
          return record?.hall?.indexOf(value) === 0;
        },
        renderType: 'select',
        width: 150,
        render: (text: string) => {
          return hallOptions.filter((item: any) => item.value === text)?.[0]
            ?.label;
        },
      },
      {
        title: '电影名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
        renderType: 'input',
        filters: filmOptions,
        filterSearch: true,
        onFilter: (value: string, record: any) => {
          setFilmValue(value);
          return record?.name?.indexOf(value) === 0;
        },
      },
      {
        title: '电影类型',
        dataIndex: 'type',
        editable: true,
        renderType: 'input',
      },
      {
        title: '价格',
        dataIndex: 'price',
        editable: true,
        renderType: 'number',
      },
      {
        title: '放映时间',
        dataIndex: 'time',
        editable: true,
        renderType: 'datePicker',
        render: (text: any) => {
          if (text && typeof text === 'object') {
            return text.format('HH:mm');
          } else {
            return text;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 240,
        render: (_: any, record: Item, index: number) => {
          const editable = isEditing(record);
          return (
            <>
              {editable ? (
                <>
                  <Button type="link" onClick={() => save(record.key)}>
                    保存
                  </Button>
                  <Button type="link" title="确认取消修改吗?" onClick={cancel}>
                    取消
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="link"
                    disabled={editingKey !== ''}
                    onClick={() => edit(record)}
                  >
                    修改
                  </Button>
                  <Popconfirm
                    title="确定删除吗?"
                    onConfirm={() => handleDelete(record.key)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </>
              )}
              <Button
                type="link"
                disabled={editingKey !== ''}
                onClick={() => handleCopy(record, index)}
              >
                复制
              </Button>
            </>
          );
        },
      },
    ];

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: Item) => ({
          record,
          inputType: col?.renderType ? col.renderType : 'input',

          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    return (
      <Form form={form} component={false}>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 8 }}>
          新增排片
        </Button>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={originData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    );
  };

export default AddMovie;
