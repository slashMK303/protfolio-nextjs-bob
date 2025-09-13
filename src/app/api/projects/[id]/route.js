// src/app/api/projects/[id]/route.js
import { db } from '../../../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const data = await request.json();
        const projectRef = doc(db, 'projects', id);
        await updateDoc(projectRef, data);
        return NextResponse.json({ message: 'Project updated successfully!' });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const projectRef = doc(db, 'projects', id);
        await deleteDoc(projectRef);
        return NextResponse.json({ message: 'Project deleted successfully!' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
    }
}