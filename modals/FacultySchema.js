
import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    key: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
      //  unique: true
    },
    shortcut: {
        type: String,
        required: true,
        unique: true
    },
    freeshifts: {
        type: [String],
        required: true
    },
    max: {
        type: String,
        required: true
    },
});

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export default Faculty;
