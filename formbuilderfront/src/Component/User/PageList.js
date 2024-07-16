import React, { useState, useEffect } from 'react';

import DataTable from 'react-data-table-component';
import FormService from '../../Services/FormService';
import PageService from '../../Services/Pages';
import { Link } from 'react-router-dom';
const PageList= ()=>
    {
        const [forms, setForms] = useState([]);
        const [pages, setPages] = useState([]);
  
    useEffect(() => {
      

        const FetchPages = async () => {
            try {
                const fetchedPages = await PageService.getPage();
                setPages(fetchedPages);
            } catch (error) {
                console.error('Error fetching pages', error);
            }
        };

       
        FetchPages();
    }, []);



  

  
    
    const columns = [
        {
            name: 'Page Title',
            selector: row => row.title,
            sortable: true,
            cell: row => <Link to={`/pagedetail/${row._id}`} className="text-blue-500 hover:underline">{row.title}</Link>
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Link',
            selector: row => row.link,
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
            <h1 className="text-2xl font-bold mb-4">Page List</h1>
            
            <DataTable
                title="Pages and Assigned Forms"
                columns={columns}
                data={pages}
                pagination
            />
        </div>
    );
      };
      
    export default PageList;