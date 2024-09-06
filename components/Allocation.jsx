import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    Card,
    ConfigProvider,
    List,
    Select,
    Space
} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {getCounts, getExamDates, getFaculty, saveCounts, saveExamDates} from '@/app/Store/faculty/faculty-action';
import { EditOutlined, SaveFilled} from '@ant-design/icons';
import * as XLSX from "xlsx";

const Allocation = () => {
    const dispatch = useDispatch();
    const [examDates,setExamDates] = useState({});
    const {examdates, facultyDetails,facultyCounts} = useSelector((state) => state.faculty);
    const [options,setOptions] = useState([])
    const [selectedButton,setSelectedButton] = useState(null);
     const [selectedCounts, setSelectedCounts] = useState({});

    const buttonsRefs = useRef([]);

    const toggleSelect = (date, exam) => {
        setSelectedButton({date, exam});
    };

    useEffect(() => {
        dispatch(getExamDates());
        dispatch(getFaculty());
        dispatch(getCounts());
    }, [dispatch]);


    useEffect(() => {
        if (examdates) {
            setExamDates(examdates);
        }
        if (facultyDetails) {
            setOptions(facultyDetails);
        }
        if(facultyCounts){
            setSelectedCounts(facultyCounts);
        }
    }, [facultyDetails,examdates,facultyCounts]);


    const handleExamAllocation = (date, exam, values) => {
        const updatedExamDates = { ...examDates };
        updatedExamDates[date] = { ...(updatedExamDates[date] || {}) };
        updatedExamDates[date][exam] = values;


        setExamDates(updatedExamDates);
    };

    const exportToExcel = () => {
        const data = [];
        // Create header row
        const header = [
            'Faculty', ...Object
                .keys(examDates)
                .sort()
                .flatMap(date => {
                    return Object
                        .keys(examDates[date])
                        .map(option => `${date} (${option})`);
                })
        ];
        data.push(header);

        // Create data rows
        options.forEach(option => {
            const row = [option.shortcut];
            Object
                .keys(examDates)
                .sort()
                .forEach(date => {
                    Object
                        .keys(examDates[date])
                        .map(opt => {
                            if (examDates[date][opt].includes(option.shortcut)) {
                                row.push(option.shortcut)
                            } else {
                                row.push('')
                            }
                        });
                });
            data.push(row);
        });
        const ws = XLSX
        .utils
        .aoa_to_sheet(data);
        const wb = XLSX
        .utils
        .book_new();
        ws['!cols'] = [{ width: 20 }, ...Array(header.length - 1).fill({ width: 15 })];
        XLSX
            .utils
            .book_append_sheet(wb, ws, 'Timetable');
        XLSX.writeFile(wb, 'Timetable.xlsx');
    };

    const labelRender = (props) => {
        const {label, value} = props;
        if (label) {
            return value;
        }
        return <span>{value}</span>;
    };

    const handlesave = async() => {
        try {
            dispatch(saveExamDates(examDates));
            const counts = {};
            Object.keys(examDates).forEach(date => {
                Object.keys(examDates[date]).forEach(exam => {
                    const values = examDates[date][exam] || [];
                    values.forEach(value => {
                        if (counts[value]) {
                            counts[value]++;
                        } else {
                            counts[value] = 1;
                        }
                    });
                });
            });
            setSelectedCounts(counts);
            dispatch(saveCounts(selectedCounts));
        } catch (error) {
            console.error('Error saving timetable:', error);
        } finally {
            setSelectedButton(null);
        }
    };

    const filterOptions = (option) => {
        const selectedCount = selectedCounts && selectedCounts[option.shortcut];

        if(!selectedCount && option.max >0){
            return true
        }
        return  (selectedCount < option.max && selectedCount > 0);

    };

    return ( <> <div
        style={{
        height: '95%',
        overflow: 'auto',
        padding: '16px 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)'
    }}>
         <ConfigProvider
      theme={{
        components: {
            Select: {
                multipleItemColorDisabled:"#023047",
          },
        },
      }}
    >
        {Object
            .entries(examDates)
            .map(([date, exams]) => (
                <List
                    grid={{
                    gutter: 24,
                    column: 2
                }}
                    key={date}
                    dataSource={Object.keys(exams)}
                    renderItem={(exam, index) => (
                    <List.Item>
                        <Card
                            title={`${date} ${`    `} [${exam}]  `}
                            key={`${date} - ${exam}`}
                            hoverable
                            className='shadow-md'
                            extra={selectedButton && selectedButton.date === date && selectedButton.exam === exam
                            ? <SaveFilled
                                    key="save"
                                    title='Save'
                                    onClick={handlesave}
                                    style={{
                                    fontSize: '20px'
                                }}/>
                            : <EditOutlined
                                key="edit"
                                style={{
                                fontSize: '20px'
                            }}
                                onClick={() => toggleSelect(date, exam)}/>}>
                            <Select
                                mode="multiple"
                                style={{
                                width: '100%'
                            }}
                                placeholder={`Select Faculty`}
                                onChange={(values) => handleExamAllocation(date, exam, values)}
                                options={options.filter(filterOptions).map(option => ({label: option.name, value: option.shortcut, name: option.name}))}
                                labelRender={labelRender}
                                ref={(ref) => (buttonsRefs.current[`${date} - ${exam}`] = ref)}
                                disabled={selectedButton && selectedButton.date === date && selectedButton.exam === exam
                                ? false
                                : true}
                                optionRender={(option) => (
                                <Space>
                                    {option.label}
                                </Space>
                            )}
                                value={examDates[date][exam] || []}/>
                        </Card>
                    </List.Item>
                )}/>
            ))}
            </ConfigProvider>
    </div>

    < Button type = "primary" onClick = {exportToExcel} style = {{ margin: '20px 10px' }} > Export to Excel </Button>
            </>

          );
};

export default Allocation;
