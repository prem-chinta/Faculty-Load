"use client"
import React, {useEffect, useState} from 'react';
import {
    Form,
    Input,
    message,
    Popconfirm,
    Table,
    Typography,
    Select,
    Button,
    Tag,
    Spin,
    Skeleton
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import { addFaculty, deleteFaculty, getFaculty, updateFaculty } from '@/app/Store/faculty/faculty-action';
const options = [
    {
        value: 'Mon-FN',
        label: 'Monday-FN'
    }, {
        value: 'Mon-AN',
        label: 'Monday-AN'
    }, {
        value: 'Tue-FN',
        label: 'Tuesday-FN'
    }, {
        value: 'Tue-AN',
        label: 'Tuesday-AN'
    }, {
        value: 'Wed-FN',
        label: 'Wednesday-FN'
    }, {
        value: 'Wed-AN',
        label: 'Wednesday-AN'
    }, {
        value: 'Thu-FN',
        label: 'Thursday-FN'
    }, {
        value: 'Thu-AN',
        label: 'Thursday-AN'
    }, {
        value: 'Fri-FN',
        label: 'Friday-FN'
    }, {
        value: 'Fri-AN',
        label: 'Friday-AN'
    }, {
        value: 'Sat-FN',
        label: 'Saturday-FN'
    }
    , {
        value: '',
        label: 'None'
    }
];

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'select'
        ? (<Select
            mode="multiple"
            size="large"
            placeholder="Please select Free Shifts"
            initialvalues={[]}
            style={{
            width: '100%'
        }}
            options={options}/>)
        : dataIndex === 'shortcut'
            ? (<Input placeholder="Shortcut" size="large"/>)
            : dataIndex === 'name'
                ? (<Input placeholder="Please Enter Faculty Name" size="large"/>)
                : dataIndex === 'key'
                    ? (<Input placeholder="#" inputMode="numeric" size="large" disabled/>)
                    : (<Input inputMode="numeric" size="large"/>);
    return  (
        <td {...restProps}>
            {editing
                ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                        margin: 0
                    }}
                        rules={[{
                            required: true,
                            message: `Please Input ${title}!`
                        }
                    ]}>
                        {inputNode}
                    </Form.Item>
                )
                : (children)}
        </td>
    );
};

const Faculty = () => {
    const [editingKey,setEditingKey] = useState('');
    const [submittable,setSubmittable] = useState(true);
    const [editable,setEditable] = useState(false);
    const [start,setStart] = useState(null);
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const [data,setData] = useState([]);
    const {facultyDetails,loading} = useSelector((state) => state.faculty);

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getFaculty());
        console.log("facultyDetails")
  }, [dispatch]);

    useEffect(() => {
        if (facultyDetails) {
            setData(facultyDetails);
        }
    }, [facultyDetails]);
//console.log("first",facultyDetails)

const isEditing = (record) => record.key === editingKey;

useEffect(() => {
  form.validateFields({validateOnly: true})
  .then(() => setSubmittable(true))
  .catch(() => setSubmittable(false));
    },[form, values]);

    const edit = (record) => {
        form.setFieldsValue({
            key: null,
            name: '',
            shortcut: '',
            freeshifts: [],
            max: '',
            ...record
        });
        setEditingKey(record.key);
        setEditable(true);
    };

    const cancel = () => {
        setEditingKey('');
        setEditable(false);
    };

    const save = async(key) => {
        try {
            const row = await form.validateFields();
            if (start) {
              dispatch(addFaculty(key, row));
            } else {
                const upData = data.filter((item) => item.key === key);
                dispatch(updateFaculty(upData[0]._id, row));
            }
            setEditingKey('');
            setEditable(false);
            setStart(false);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const findMissingCount = () => {
        if (data.length == 0)
            return 1
        let arr = data.map(item => item.key)
        let max = Math.max(...arr);
        for (let i = 1; i <= max; i++) {
            if (!arr.includes(i)) {
                return i;
            }
        }
        return max + 1;
    };

    const handleAdd = () => {
        const count = findMissingCount();
        const newData = {
            key: count
        };
        setData([
            ...data,
            newData
        ]);
        form.setFieldsValue({
            key: count,
            name: '',
            shortcut: '',
            freeshifts: [],
            max: '',
            ...newData
        });
        setEditingKey(count)
        setEditable(true);
        setStart(true);
    };

    const handleDelete = async(record) => {
        try {
            if (record._id) {
              dispatch(deleteFaculty(record._id));
            } else {
                const delData = data.filter((item) => item.key !== record.key);
                setData(delData);
            }
        } catch (error) {
            console.log('delete error', error);
        } finally {
            setEditingKey('');
            setEditable(false);
        }
    };

    const tagRender = (props) => {
        const {label, closable, onClose} = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color='gold'
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                marginInlineEnd: 4
            }}>
                {label}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'S. No',
            dataIndex: 'key',
            width: '5%',
            fixed: true,
            editable: true
        }, {
            title: 'Shortcut Name',
            dataIndex: 'shortcut',
            width: '8%',
            fixed: true,
            editable: true
        }, {
            title: 'Faculty Name',
            dataIndex: 'name',
            width: '20%',
            editable: true
        }, {
            title: 'Free Shifts',
            dataIndex: 'freeshifts',
            editable: true,
            width: '30%',
            render: (_, record) => {
                const editable = isEditing(record) ;
                return  (
                  <span>
                        <Select
                            mode="multiple"
                            size="medium"
                            placeholder="Please select"
                            tagRender={tagRender}
                            value={record.freeshifts}
                            style={{
                            width: '100%',
                            backgroundColor: 'white'
                        }}
                            disabled={!editable}/>
                    </span>
                );
            }
        }, {
            title: 'MAX Allocations',
            dataIndex: 'max',
            width: '10%',
            editable: true
        }, {
            title: 'Operation',
            dataIndex: 'operation',
            width: '15%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable
                    ? (
                        <span>
                            <Typography.Link
                                onClick={() => save(record.key)}
                                style={{
                                marginRight: 8
                            }}
                                disabled={!submittable}>
                                Save
                            </Typography.Link>
                            <Popconfirm title="Sure to cancel?" onClick={cancel}>
                                <a className='text-orange-500 mr-4' disabled={start}>Cancel</a>
                            </Popconfirm>
                            <Popconfirm title="Sure to Delete?" onConfirm={() => handleDelete(record)}>
                                <a className='text-red-700'>Delete</a>
                            </Popconfirm>
                        </span>
                    )
                    : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                    );
            }
        }
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'freeshifts'
                    ? 'select'
                    : col.dataIndex === 'name'
                        ? 'text'
                        : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    if (loading) {
      return <Skeleton active />;
  }
    return (
        <Form form={form} component={false}>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                marginBottom: 16,
                borderRadius: 10
            }}
                disabled={editable}>
                Add a row
            </Button>
            <Table
                scroll={{
                x: 1500,
                y: 400
            }}
            size='small'
                components={{
                body: {
                    cell: EditableCell
                }
            }}
                bordered
                dataSource={ data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                onChange: cancel
            }}/>
        </Form>
    );
};
export default Faculty;