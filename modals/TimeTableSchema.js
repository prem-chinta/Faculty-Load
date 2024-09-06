import mongoose from 'mongoose';


const TimeTableSchema = new mongoose.Schema({
    date: {
        type: String,
        unique: true,
        required: true
    },
    exams: {
        type: Object,
    }
});

const TimeTable = mongoose.models.Timetable || mongoose.model('Timetable', TimeTableSchema);

export default TimeTable;
