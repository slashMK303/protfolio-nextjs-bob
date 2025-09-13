import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const projectsCollection = collection(db, 'projects');
        const querySnapshot = await getDocs(projectsCollection);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        console.log('API POST request received.');
        const data = await request.json();
        console.log('Received data:', data);

        if (!db) {
            console.error('Firebase DB is not initialized!');
            return NextResponse.json({ error: 'Firebase DB not connected.' }, { status: 500 });
        }

        const projectsCollection = collection(db, 'projects');
        await addDoc(projectsCollection, data);

        console.log('Project added to Firestore successfully!');
        return NextResponse.json({ message: 'Project added successfully!' }, { status: 201 });
    } catch (error) {
        console.error('Error adding project:', error.message);
        return NextResponse.json({ error: 'Failed to add project.' }, { status: 500 });
    }
}