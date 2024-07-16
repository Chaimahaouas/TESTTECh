import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import FormService from '../../../Services/FormService.js';

Modal.setAppElement('#root');

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="bg-white rounded-lg shadow-xl fixed p-6 inset-x-0 top-20 mx-auto max-w-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30"
    >
      <div className="flex justify-between items-center">
        <h2>Confirm Delete</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <FiX size={24} />
        </button>
      </div>
      <div className="mt-4">
        <p>Are you sure you want to delete this form?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

const FormManagement = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', description: '', fields: [] });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(5); 
  const [formToDelete, setFormToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await FormService.getFormulaire();
        setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = forms.filter(form => {
    return (
      form.title.toLowerCase().includes(filterText.toLowerCase()) ||
      form.description.toLowerCase().includes(filterText.toLowerCase()) ||
      form.fields.some(field => field.label.toLowerCase().includes(filterText.toLowerCase()))
    );
  });

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleAddForm = async (e) => {
    e.preventDefault();
    try {
      if (selectedForm) {
        console.log('Editing form with ID:', selectedForm._id);
        
        await FormService.EditForm(selectedForm._id, newForm);
      } else {
        const createdForm = await FormService.CreateFormulaire(newForm);
        setForms([...forms, createdForm]);
      }
      const updatedForms = await FormService.getFormulaire();
      setForms(updatedForms);

      setModalIsOpen(false);
      setNewForm({ title: '', description: '', fields: [] });
      setSelectedForm(null);
    } catch (error) {
      console.error('Error adding/editing form:', error);
    }
  };

  const handleAddField = () => {
    setNewForm({
      ...newForm,
      fields: [...newForm.fields, { type: '', label: '', options: [], required: false }],
    });
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = newForm.fields.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedForm(null);
    setNewForm({ title: '', description: '', fields: [] });
  };

  const handleEditForm = (form) => {
    setSelectedForm(form);
    setNewForm({ title: form.title, description: form.description, fields: form.fields });
    setModalIsOpen(true);
  };

  const handleDeleteForm = (form) => {
    setFormToDelete(form);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteForm = async () => {
    try {
      await FormService.deleteFormulaire(formToDelete._id);
      const updatedForms = await FormService.getFormulaire();
      setForms(updatedForms);
      setIsConfirmModalOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setModalIsOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Form
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
        />
      </div>

      <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentForms.map((form, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">{form.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{form.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEditForm(form)} className="text-blue-500 hover:text-blue-700 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteForm(form)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <ul className="flex">
          {Array.from({ length: Math.ceil(filteredForms.length / formsPerPage) }, (_, index) => (
            <li key={index}>
              <button
                onClick={() => paginate(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white hover:bg-blue-700'
                    : 'text-blue-500 hover:text-blue-700'
                } font-bold py-2 px-4 rounded-l`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-xl fixed p-6 inset-x-0 top-20 mx-auto max-w-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      >
        <div className="flex justify-between items-center">
          <h2>{selectedForm ? 'Edit Form' : 'Add Form'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleAddForm} className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={newForm.title}
            onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
          <textarea
            className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newForm.description}
            onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
          />
          {newForm.fields.map((field, index) => (
            <div key={index}>
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="paragraph">Paragraph</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="phone">Phone</option>
                <option value="url">URL</option>
                <option value="file">File</option>
              </select>
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                required
              />
              {(field.type === 'checkbox' || field.type === 'radio') && (
                <input
                  type="text"
                  placeholder="Options (comma separated)"
                  value={field.options.join(',')}
                  onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(','))}
                />
              )}
              <label>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                />
                Required
              </label>
            </div>
          ))}
          <button type="button" onClick={handleAddField}>Add Field</button>
         
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {selectedForm ? 'Update Form' : 'Add Form'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={confirmDeleteForm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default FormManagement;
