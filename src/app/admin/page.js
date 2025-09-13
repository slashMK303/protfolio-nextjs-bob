'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '.././lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { put } from '@vercel/blob';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Fungsi helper untuk mengekstrak nama file dari URL Blob
const extractFileNameFromUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const parts = pathname.split('/');
        return parts[parts.length - 1];
    } catch (e) {
        return url;
    }
};

export default function AdminPage() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        demoLink: '',
        viewText: 'VIEW PROJECT',
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const fetchProjects = async () => {
                    try {
                        const res = await fetch('/api/projects');
                        const data = await res.json();
                        setProjects(data);
                    } catch (error) {
                        console.error("Failed to fetch projects:", error);
                    } finally {
                        setLoadingProjects(false);
                    }
                };
                fetchProjects();
            } else {
                router.push('/login');
            }
            setLoadingUser(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                alert('File size exceeds 1 MB. Please choose a smaller image.');
                e.target.value = null;
                setFile(null);
                setThumbnailFileName('');
            } else {
                setFile(selectedFile);
                setThumbnailFileName(selectedFile.name);
            }
        } else {
            setFile(null);
            setThumbnailFileName('');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let thumbnailUrl = formData.thumbnail;

            if (file) {
                const response = await fetch(`/api/upload?filename=${file.name}`, {
                    method: 'POST',
                    body: file,
                });
                const blob = await response.json();
                thumbnailUrl = blob.url;
            } else if (!isEditing) {
                alert('Please select a thumbnail image.');
                setUploading(false);
                return;
            }

            const projectDataToSave = { ...formData, thumbnail: thumbnailUrl };

            if (isEditing) {
                await fetch(`/api/projects/${currentProjectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectDataToSave),
                });
                alert('Project updated successfully!');
            } else {
                await addDoc(collection(db, 'projects'), projectDataToSave);
                alert('Project added successfully!');
            }

            const res = await fetch('/api/projects');
            const updatedProjects = await res.json();
            setProjects(updatedProjects);

            setFormData({ title: '', description: '', thumbnail: '', demoLink: '', viewText: 'VIEW PROJECT' });
            setFile(null);
            setThumbnailFileName('');
            setIsEditing(false);
            setCurrentProjectId(null);

        } catch (error) {
            console.error('Error handling project:', error);
            alert('An error occurred.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Project deleted successfully!');
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert('Failed to delete project.');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred.');
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setCurrentProjectId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            thumbnail: project.thumbnail,
            demoLink: project.demoLink,
            viewText: project.viewText,
        });
        setThumbnailFileName(extractFileNameFromUrl(project.thumbnail));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentProjectId(null);
        setFormData({
            title: '',
            description: '',
            thumbnail: '',
            demoLink: '',
            viewText: 'VIEW PROJECT',
        });
        setThumbnailFileName('');
        setFile(null);
    };

    if (loadingUser) {
        return <div className="bg-[#121212] min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return null; // Tidak perlu render apa pun jika pengguna tidak ada, karena router akan me-redirect
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Title"
                    className="p-3 bg-gray-800 rounded-lg text-white"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Description"
                    className="p-3 bg-gray-800 rounded-lg h-32 text-white"
                    required
                />
                <input
                    type="text"
                    name="demoLink"
                    value={formData.demoLink}
                    onChange={handleFormChange}
                    placeholder="Demo Link"
                    className="p-3 bg-gray-800 rounded-lg text-white"
                    required
                />
                <label className="block mb-2 text-sm font-medium text-gray-400">
                    Upload Thumbnail
                </label>
                {isEditing && thumbnailFileName && (
                    <p className="text-sm text-gray-400 mb-2">
                        Current file: <span className="font-semibold text-white">{thumbnailFileName}</span>
                    </p>
                )}
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                    accept="image/*"
                    required={!isEditing}
                />
                {isEditing && (
                    <button type="button" onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                        Cancel Edit
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    disabled={uploading}
                >
                    {uploading ? 'Processing...' : (isEditing ? 'Update Project' : 'Add Project')}
                </button>
            </form>

            <h2 className="text-2xl font-bold mt-10 mb-4">Manage Projects</h2>
            {loadingProjects ? (
                <p>Loading projects...</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center gap-4">
                                {project.thumbnail && (
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        width={80}
                                        height={60}
                                        className="rounded-lg object-cover"
                                    />
                                )}
                                <span className="font-semibold text-lg">{project.title}</span>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                                    onClick={() => handleEdit(project)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}