import TimeTable from "@/modals/TimeTableSchema";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();
        const timetable = await TimeTable.find({}).sort({ date: 1 });
        const formattedTimetable = {};
        timetable.forEach(item => {
            const sortedExams = {};
            Object.keys(item.exams).sort().forEach(key => {
                sortedExams[key] = item.exams[key];
            });
            formattedTimetable[item.date] = sortedExams;
        });
        return NextResponse.json({ data: formattedTimetable }, { status: 200 });
    } catch (error) {
        console.log("DBError", error);
        return NextResponse.json({ message: "Fetch Failed" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { dates } = await request.json();
        await connectDB();

        const existingDates = await TimeTable.find({});
        const existingDatesMap = {};

        // Create a map for existing dates to easily check for duplicates
        existingDates.forEach(item => {
            existingDatesMap[item.date] = item;
        });

        // Update or create each date in the database
        for (let date in dates) {
            if (existingDatesMap[date]) {
                existingDatesMap[date].exams = dates[date];
                await existingDatesMap[date].save();
            } else {
                await TimeTable.create({ date, exams: dates[date] });
            }
        }

        // Remove unselected values from the database
        for (let existingDate of existingDates) {
            if (!dates[existingDate.date]) {
                await TimeTable.findByIdAndDelete(existingDate._id);
            }
        }

        return NextResponse.json({ message: 'Timetable saved successfully' }, { status: 201 });
    } catch (error) {
        console.log("DBEADD", error);
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}
