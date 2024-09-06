import mongoose from 'mongoose';


const FacultyCountsSchema = new mongoose.Schema({
    counts: {
        type: Object,
    }
});

const FacultyCounts = mongoose.models.FacultyCounts || mongoose.model('FacultyCounts', FacultyCountsSchema);

export default FacultyCounts;