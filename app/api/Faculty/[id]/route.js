// api/addFaculty/[id]/route.js
import Faculty from "@/modals/FacultySchema";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const {
            key,
            name,
            shortcut,
            freeshifts,
            max,
        } = await request.json();

        await connectDB();

        const existingFaculty = await Faculty.findOne({ key: params.id });

        if (!existingFaculty) {
            const faculty = new Faculty({
                key,
                name,
                shortcut,
                freeshifts,
                max,
            });

            await faculty.save();

            return NextResponse.json({ message: "Field Added" }, { status: 201 });
        } else {
            return NextResponse.json({ error: "Faculty already exists" }, { status: 409 });
        }
    } catch (error) {
        console.log("DBEADD", error);
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const {
            key,
            name,
            shortcut,
            freeshifts,
            max,
        } = await request.json();

        await connectDB();

        const existingFaculty = await Faculty.findById(params.id);

        if (!existingFaculty) {
            return NextResponse.json({ message: "No Faculty Found" }, { status: 201 });
        } else {
            try {

                const updatedFaculty = await Faculty.findByIdAndUpdate(params.id, {
                    key,
                    name,
                    shortcut,
                    freeshifts,
                    max,
                }, { new: true });

                if (!updatedFaculty) {
                    return NextResponse.json({ message: "Error updating faculty" }, { status: 503 });
                }
                return NextResponse.json({ message: "Success" }, { status: 201 });
            } catch (error) {
                return NextResponse.json({ error: error.message }, { status: 502 });
            }
        }
    } catch (error) {
        console.log("DBEUPDATE1", error);
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const deletedFaculty = await Faculty.findByIdAndDelete(params.id);

        if (!deletedFaculty) {
            return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
        }

        await Faculty.updateMany(
            { key: { $gt: deletedFaculty.key } },
            { $inc: { key: -1 } }
        );

        return NextResponse.json({ message: "Deletion success" }, { status: 200 });
    } catch (error) {
        console.log("DBE1", error);
        return NextResponse.json({ error: "Deletion Failed" }, { status: 500 });
    }
}