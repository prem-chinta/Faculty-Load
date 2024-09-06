
import Faculty from "@/modals/FacultySchema";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const data = await Faculty.find().sort({ key: 1 });
        console.log("Found data", data);
        return NextResponse.json({ data: data }, { status: 201 });
    } catch (error) {
        console.log("DBError", error);
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}
