'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '.././lib/firebase';
import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { put } from '@vercel/blob';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
        order: 0,
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const MAX_FILE_SIZE = 1 * 1024 * 1024;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const fetchProjects = async () => {
                    try {
                        const projectsCollectionRef = collection(db, 'projects');
                        const q = query(projectsCollectionRef, orderBy('order', 'asc'));
                        const querySnapshot = await getDocs(q);
                        const data = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
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
            let projectDataToSave = {};

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

            if (isEditing) {
                projectDataToSave = { ...formData, thumbnail: thumbnailUrl };
                await updateDoc(doc(db, 'projects', currentProjectId), projectDataToSave);
                alert('Project updated successfully!');
            } else {
                const newOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order)) + 1 : 1;
                projectDataToSave = { ...formData, thumbnail: thumbnailUrl, order: newOrder };
                await addDoc(collection(db, 'projects'), projectDataToSave);
                alert('Project added successfully!');
            }

            setFormData({ title: '', description: '', thumbnail: '', demoLink: '', viewText: 'VIEW PROJECT', order: 0 });
            setFile(null);
            setThumbnailFileName('');
            setIsEditing(false);
            setCurrentProjectId(null);

            const projectsCollectionRef = collection(db, 'projects');
            const q = query(projectsCollectionRef, orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            const updatedProjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(updatedProjects);

        } catch (error) {
            console.error('Error handling project:', error);
            alert('An error occurred.');
        } finally {
            setUploading(false);
        }
    };

    const handleMove = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === projects.length - 1) return;

        const newProjects = [...projects];
        const currentProject = { ...newProjects[index] };
        const otherProject = { ...newProjects[direction === 'up' ? index - 1 : index + 1] };

        const tempOrder = currentProject.order;
        currentProject.order = otherProject.order;
        otherProject.order = tempOrder;

        newProjects[index] = otherProject;
        newProjects[direction === 'up' ? index - 1 : index + 1] = currentProject;

        setProjects(newProjects);

        try {
            await updateDoc(doc(db, 'projects', currentProject.id), { order: currentProject.order });
            await updateDoc(doc(db, 'projects', otherProject.id), { order: otherProject.order });
        } catch (error) {
            console.error('Failed to move project:', error);
            alert('Failed to update project order in database.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'projects', id));
            alert('Project deleted successfully!');

            setProjects(projects.filter(p => p.id !== id));
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
            order: project.order,
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
            order: 0,
        });
        setThumbnailFileName('');
        setFile(null);
    };

    if (loadingUser) {
        return <div className="bg-[#121212] min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="bg-[#121212] min-h-screen text-[#e8e8e8] flex">

            <div className="hidden lg:flex flex-col w-64 bg-[#232323] p-8 border-r border-[#4d4d4d] h-screen fixed">
                <h1 className="text-3xl font-extrabold mb-8">NMK Dashboard</h1>
                <nav className="flex-1">
                    <ul className="space-y-4">
                        <li>
                            <a href="#" className="flex items-center gap-4 text-lg font-semibold bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors duration-200">
                                Projects
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-lg font-semibold text-red-500 hover:text-red-400 hover:cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Logout
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 p-8 lg:ml-64">
                <header className="flex lg:hidden justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold">NMK Dashboard</h1>
                    <motion.button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition duration-200 hover:cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Logout
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    <motion.div
                        className="bg-[#232323] p-8 rounded-xl shadow-lg border border-[#4d4d4d] h-fit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-semibold mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                placeholder="Title"
                                className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg outline-none bg-transparent"
                                required
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                placeholder="Description"
                                className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg outline-none resize-y bg-transparent"
                                rows="4"
                                required
                            />
                            <input
                                type="text"
                                name="demoLink"
                                value={formData.demoLink}
                                onChange={handleFormChange}
                                placeholder="Demo Link"
                                className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg outline-none bg-transparent"
                                required
                            />
                            <label className="block text-sm font-medium text-gray-400">
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
                                hover:file:bg-blue-100 hover:cursor-pointer"
                                accept="image/*"
                                required={!isEditing}
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                {isEditing && (
                                    <motion.button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-[#4d4d4d] text-[#e8e8e8] px-6 py-3 rounded-xl text-lg font-semibold w-full md:w-auto transition-colors duration-200 hover:bg-[#6c6c6c] hover:cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                )}
                                <motion.button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold w-full md:w-auto transition-colors duration-200 hover:bg-blue-700 hover:cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {uploading ? 'Processing...' : (isEditing ? 'Update' : 'Add')}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                        className="bg-[#232323] p-8 rounded-xl shadow-lg border border-[#4d4d4d] h-fit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-semibold mb-6">Manage Projects</h2>
                        {loadingProjects ? (
                            <p className="text-[#e8e8e8]">Loading projects...</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {projects.map((project, index) => (
                                    <div key={project.id} className="bg-[#4d4d4d] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-bold text-[#e8e8e8]">{(index + 1).toString().padStart(2, '0')}</span>
                                            {project.thumbnail && (
                                                <Image
                                                    src={project.thumbnail}
                                                    alt={project.title}
                                                    width={80}
                                                    height={60}
                                                    className="rounded-lg object-cover"
                                                />
                                            )}
                                            <span className="font-semibold text-lg text-[#e8e8e8]">{project.title}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0">

                                            <motion.button
                                                onClick={() => handleMove(index, 'up')}
                                                disabled={index === 0}
                                                className={`bg-[#e8e8e8] text-[#121212] font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:cursor-pointer ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                ▲
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleMove(index, 'down')}
                                                disabled={index === projects.length - 1}
                                                className={`bg-[#e8e8e8] text-[#121212] font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:cursor-pointer ${index === projects.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                ▼
                                            </motion.button>

                                            <motion.button
                                                className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:bg-yellow-700 hover:cursor-pointer"
                                                onClick={() => handleEdit(project)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:bg-red-700 hover:cursor-pointer"
                                                onClick={() => handleDelete(project.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}