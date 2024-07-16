import axios from 'axios';
const API_URL = 'http://localhost:3000/api/pages/'; 
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
   // console.log('User:', user);
    return user ? user.token : null;
  };
  const getPage= async () => {
    const response = await axios.get('http://localhost:3000/api/pages/pages');
    return response.data;
}
  const getPages=async() => {
    try
    {
        const token = getAuthToken();
      const response = await axios.get(`${API_URL}getAllPages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        
      });
      return Array.isArray(response.data) ? response.data : [];

    }catch(error)
    {
    console.error('Error fetching forms:', error);
    throw error;
    }
  }
  const CreatePages = async(page)=>
    {
      try
      {
        const token=getAuthToken();
        console.log('Form Data:', page);
        const response=await axios.post(`${API_URL}createPage`,page,
          {
            headers:
            {
              Authorization: `Bearer ${token}`

            }
          }
        );
        return response.data;
      }catch(error)
      {
        console.error('error creating',error);
        throw error;
      }
    }
    const deletePages = async (id) =>
        {
          try {
            const token = getAuthToken();
            await axios.delete(`${API_URL}DeletePage/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          } catch (error) {
            console.error('Error deleting form:', error);
            throw error;
          }
  
        }
        const EditPage = async(id,page)=>
          {
            try
            {
  
              const token=getAuthToken();
              await axios.put(`${API_URL}UpdatePage/${id}`,page,
                {
                  headers:{
                    Authorization:`Bearer ${token}`
                  }
                }
              )
  ;
            }catch(error)
            {
              console.error('Error updating form')
            }
           
  
          }
          const getPageById = async (pageId) => {
            try {
              const response = await axios.get(`${API_URL}GetPageById/${pageId}`);
              return response.data; 
            } catch (error) {
              console.error("Error getting page", error);
              throw error; 
            }
          };
  // eslint-disable-next-line import/no-anonymous-default-export
  export default
  {
    getPages,
    CreatePages,
    deletePages,
    EditPage,
    getPage,
    getPageById
   
  }