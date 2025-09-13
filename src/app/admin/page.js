// src/app/admin/page.js (contoh sederhana)
'use client';

import React, { useState } from 'react';

export default function AdminPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        demoLink: '',
        viewText: 'VIEW PROJECT',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert('Project added successfully!');
                setFormData({ title: '', description: '', thumbnail: '', demoLink: '', viewText: 'VIEW PROJECT' });
            } else {
                alert('Failed to add project.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div className="container mx-auto p-4 min-h-screen bg-[#121212] text-white">
            <h1 className="text-2xl mb-4">Add New Project</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="p-2 bg-transparent border border-[#3b82f6] rounded-lg" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-2 bg-transparent border border-[#3b82f6] rounded-lg" />
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Thumbnail URL" required className="p-2 bg-transparent border border-[#3b82f6] rounded-lg" />
                <input type="text" name="demoLink" value={formData.demoLink} onChange={handleChange} placeholder="Demo Link" required className="p-2 bg-transparent border border-[#3b82f6] rounded-lg" />
                <button type="submit" className="bg-[#3b82f6] text-white p-2 rounded-lg">Add Project</button>
            </form>
        </div>
    );
}
