import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import FormService from '../../Services/FormService';
import PageService from '../../Services/Pages';

const AssignFormToPages = () => {
    const [forms, setForms] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedForm, setSelectedForm] = useState('');
    const [selectedPages, setSelectedPages] = useState([]);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    useEffect(() => {
        const FetchForms = async () => {
            try {
                const fetchedForms = await FormService.getFormulaire();
                setForms(fetchedForms);
            } catch (error) {
                console.error('Error fetching forms', error);
            }
        };

        const FetchPages = async () => {
            try {
                const fetchedPages = await PageService.getPage();
                setPages(fetchedPages);
            } catch (error) {
                console.error('Error fetching pages', error);
            }
        };

        FetchForms();
        FetchPages();
    }, []);

    const handleFormChange = (event) => {
        setSelectedForm(event.target.value);
    };

    const handlePageSelection = (event) => {
        const value = event.target.value;
        setSelectedPages(prev =>
            prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = getAuthToken();
            const response = await axios.post(`http://localhost:3000/api/pages/assignFormToPages`, {
                formId: selectedForm,
                pageIds: selectedPages
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Form assigned to pages successfully');
            console.log(response.data);
        } catch (error) {
            console.error('Error assigning form to pages:', error);
            alert('Error assigning form to pages');
        }
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Page Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Assigned Forms',
            selector: row => row.forms.map(form => form.title).join(','),
            sortable: true,
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Assign Form to Pages</h1>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label htmlFor="formSelect" className="block text-sm font-medium text-gray-700">Select Form:</label>
                    <select
                        id="formSelect"
                        value={selectedForm}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                    
                        <option value="">-- Select Form --</option>
                        {forms.map(form => (
                            <option key={form._id} value={form._id}>{form.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Pages:</label>
                    <div className="space-y-2">
                        {pages.map(page => (
                            <div key={page._id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={page._id}
                                    checked={selectedPages.includes(page._id)}
                                    onChange={handlePageSelection}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm text-gray-900">{page.title}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Assign Form to Pages
                </button>
            </form>
            <DataTable
                title="Pages and Assigned Forms"
                columns={columns}
                data={pages}
                pagination
            />
        </div>
    );
};

export default AssignFormToPages;
