import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageService from '../../../Services/Pages';
import axios from 'axios';

const PageDetails = () => {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const fetchedPage = await PageService.getPageById(pageId);
        setPage(fetchedPage);
        
        if (fetchedPage && fetchedPage.forms) {
          const initialFormData = {};
          fetchedPage.forms.forEach(form => {
            form.fields.forEach(field => {
              initialFormData[field.label] = ''; 
            });
          });
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error(`Error fetching page ${pageId} details:`, error);
      }
    };

    if (pageId) {
      fetchPageDetails();
    }
  }, [pageId]);

  const handleInputChange = (e, label) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [label]: value,
    });
  };

  const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      //const payload = { formData };
      const payload = { 
        formData: { 
          form: this.state.formId, // Assuming you have the formId available
          page: pageId, 
          //user: userId, // Assuming you have the userId available
          data: formData 
        } 
      };
    
      console.log('Payload:', payload);
      const response = await axios.post(`http://localhost:3000/api/forms/submit/${pageId}`, { formData }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        }
      });
      if (response.status === 200) {
        console.log('Form submitted successfully:', response.data);
      } else {
        console.error('Error submitting form:', response.data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {page ? (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
              <p className="text-gray-700 mb-2">{page.description}</p>
              <p className="text-gray-600 mb-4">Link: {page.link}</p>
              <div className="border-t border-gray-200 pt-4">
                {page.forms.map((form, formIndex) => (
                  <div key={formIndex} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                    <p className="text-gray-600 mb-2">{form.description}</p>
                    <div className="grid grid-cols-1 gap-4">
                      {form.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                          <label className="block text-gray-700">{field.label}</label>
                          <input
                            type={field.type}
                            className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={formData[field.label]}
                            onChange={(e) => handleInputChange(e, field.label)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading page details...</p>
      )}
    </div>
  );
};

export default PageDetails;



