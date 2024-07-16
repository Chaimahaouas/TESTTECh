import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import PageServices from '../../../Services/Pages';
import { Link } from 'react-router-dom';
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
        <p>Are you sure you want to delete this page?</p>
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

const PageManagement = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', description: '', link: '' });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerPage] = useState(5); 
  const [pageToDelete, setPageToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const fetchedPages = await PageServices.getPages();
        setPages(fetchedPages);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => {
    return (
      (page.title && page.title.toLowerCase().includes(filterText.toLowerCase())) ||
      (page.description && page.description.toLowerCase().includes(filterText.toLowerCase())) ||
      (page.link && page.link.toLowerCase().includes(filterText.toLowerCase()))
    );
  });

  const indexOfLastPage = currentPage * pagesPerPage;
  const indexOfFirstPage = indexOfLastPage - pagesPerPage;
  const currentPages = filteredPages.slice(indexOfFirstPage, indexOfLastPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleAddPage = async (e) => {
    e.preventDefault();
    try {
      if (selectedPage) {
        await PageServices.EditPage(selectedPage._id, newPage);
      } else {
        const createdPage = await PageServices.CreatePages(newPage);
        setPages([...pages, createdPage]);
      }
      const updatedPages = await PageServices.getPages();
      setPages(updatedPages);

      setModalIsOpen(false);
      setNewPage({ title: '', description: '', link: '' });
      setSelectedPage(null);
    } catch (error) {
      console.error('Error adding/editing page:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPage(null);
    setNewPage({ title: '', description: '', link: '' });
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    setNewPage({ title: page.title, description: page.description, link: page.link });
    setModalIsOpen(true);
  };

  const handleDeletePage = (page) => {
    setPageToDelete(page);
    setIsConfirmModalOpen(true);
  };

  const confirmDeletePage = async () => {
    try {
      await PageServices.deletePages(pageToDelete._id);
      const updatedPages = await PageServices.getPages();
      setPages(updatedPages);
      setIsConfirmModalOpen(false);
      setPageToDelete(null);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setModalIsOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Page
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPages.map((page, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">{page.title}
              <Link to={`/pagedetail/${page._id}`}>{page.title}</Link></td>
              <td className="px-6 py-4 whitespace-nowrap">{page.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
              <a href={page.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  {page.link}
                </a></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEditPage(page)} className="text-blue-500 hover:text-blue-700 mr-2">
                  <FiEdit />
                </button>
                <button onClick={() => handleDeletePage(page)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <ul className="flex">
          {Array.from({ length: Math.ceil(filteredPages.length / pagesPerPage) }, (_, index) => (
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-xl fixed p-6 inset-x-0 top-20 mx-auto max-w-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      >
        <div className="flex justify-between items-center">
          <h2>{selectedPage ? 'Edit Page' : 'Add Page'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleAddPage} className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={newPage.title}
            onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
          <textarea
            className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newPage.description}
            onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
            required
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Link</label>
          <input
            type="text"
            value={newPage.link}
            onChange={(e) => setNewPage({ ...newPage, link: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {selectedPage ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={confirmDeletePage}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default PageManagement;
