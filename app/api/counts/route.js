import FacultyCounts from "@/modals/CountSchema";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();
        const data = await FacultyCounts.find();
        if (!data) {
            // If no counts found, respond with a 404 status code and a message
            return NextResponse.json({ message: 'Faculty counts not found' }, { status: 404 });
          }
        return NextResponse.json({ data: data[0] }, { status: 201 });
    } catch (error) {
        console.log("DBError", error);
        return NextResponse.json({ message: "Fetch Failed" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { counts } = await request.json();
        await connectDB();

        const countsExists = await FacultyCounts.exists({});

        if (!countsExists) {
          // If FacultyCounts collection is empty, create a new document and insert the selectedCounts
          await FacultyCounts.create({ counts: counts });
        } else {
          // If FacultyCounts collection already exists, update the counts
          await FacultyCounts.findOneAndUpdate({}, { counts: counts });
        }

        return NextResponse.json({ message: 'Counts saved successfully' }, { status: 201 });
    } catch (error) {
        console.log("DBEADD", error);
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}
