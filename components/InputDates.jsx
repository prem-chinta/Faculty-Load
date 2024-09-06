import { DatePicker,  List, Card,  ConfigProvider, Spin } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {  EditOutlined, SaveFilled,} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getExamDates, saveExamDates } from '@/app/Store/faculty/faculty-action';


export default function InvigilationAllocation() {
    const [examDates, setExamDates] = useState({});
    const [loading, setLoading] = useState(false);
    const [editDate, setEditDate] = useState({
        'A':false, 'B':false, 'C':false,
    });
    const {examdates} = useSelector((state) => state.faculty);
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getExamDates());
  }, [dispatch]);

  useEffect(() => {
    if (examdates) {
        setExamDates(examdates);
    }
}, [examdates]);


    const getSelectedDates = (examdate) => {
        const selectedDates = [];
        for (const [date, exams] of Object.entries(examDates)) {
            if (exams[examdate]) {
                selectedDates.push(dayjs(date, 'DD-MM-YY')); // Convert to string format
            }
        }
        return selectedDates;
    };

    const onChange = (dates, dateStrings, examdate) => {
        const updatedExamDates = { ...examDates };

        dates?.forEach((date, index) => {
          const dateString = dateStrings[index];
          // Ensure immutability by creating a new object for each date
          updatedExamDates[dateString] = { ...(updatedExamDates[dateString] || {}) };
          // Ensure immutability by creating a new array for each exam date
          updatedExamDates[dateString][examdate] = [...(updatedExamDates[dateString][examdate] || [])];
      });

      // Cleanup: Remove dates not selected
      Object.keys(updatedExamDates).forEach(date => {
        if (!dateStrings.includes(date)) {
          updatedExamDates[date] = { ...(updatedExamDates[date] || {}) };
            if (updatedExamDates[date] && updatedExamDates[date][examdate]) {
                delete updatedExamDates[date][examdate];
                // Check if date object is empty after deletion
                if (Object.keys(updatedExamDates[date]).length === 0) {
                    delete updatedExamDates[date];
                }
            }
        }});
        setExamDates(updatedExamDates);
    };


    const saveToDatabase = async () => {
        setLoading(true);
        try {
            dispatch(saveExamDates(examDates));
        } catch (error) {
            console.error('Error saving timetable:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return <div className='h-full flex items-center justify-center'><Spin /></div>;
    }

    const listitems = [
        {
          title: 'A',
        },
        {
          title: 'B',
        },
        {
          title: 'C',
        },
      ];

const handlesave = (title) =>{
    saveToDatabase();
    setEditDate({...editDate,[title]:false})
}

    return (
        <>
            <ConfigProvider
      theme={{
        components: {
            DatePicker: {
                multipleItemColorDisabled:"#023047",
          },
        },
      }}
    >
<List
    grid={{
      gutter: 24,
      column: 2,
    }}
    dataSource={listitems}
    renderItem={(item) => (
      <List.Item>
        <Card title={item.title}
        hoverable
        className='shadow-md'
        extra={editDate[item.title]?<SaveFilled key="save" title='Save' onClick={()=>handlesave(item.title)} style={{ fontSize: '20px' }}  />:<EditOutlined key="edit" style={{ fontSize: '20px' }} onClick={()=>setEditDate({...editDate,[item.title]:true})} />}
    >
            <DatePicker
                    key={item.title}
                    disabled={!editDate[item.title]}
                    order
                    multiple
                    onChange={(dates, dateStrings) => onChange(dates, dateStrings, item.title)}
                    format={'DD-MM-YY'}
                    size="large"
                    value={getSelectedDates(item.title)}
                />
                </Card>
      </List.Item>
    )}
  />
  </ConfigProvider>
        </>
    );
}
