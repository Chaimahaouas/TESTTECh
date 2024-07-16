import axios from 'axios';

const API_URL = 'http://localhost:3000/api/forms/'; 
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
   // console.log('User:', user);
    return user ? user.token : null;
  };
  const getFormulaire = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}getAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log('Request Headers:', response.config.headers);
      //console.log("response.data.data",response.data.data);
     return Array.isArray(response.data) ? response.data : [];
     // return response.data;
      
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  };
  const CreateFormulaire = async(form)=>
    {
      try
      {
        const token=getAuthToken();
        console.log('Form Data:', form);
        const response=await axios.post(`${API_URL}create`,form,
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
    const deleteFormulaire = async (id) =>
      {
        try {
          const token = getAuthToken();
          await axios.delete(`${API_URL}delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error deleting form:', error);
          throw error;
        }

      }
      const EditForm = async(id,form)=>
        {
          try
          {

            const token=getAuthToken();
            await axios.put(`${API_URL}updateform/${id}`,form,
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
// eslint-disable-next-line import/no-anonymous-default-export
  export default
  {
    getFormulaire,
    CreateFormulaire,
    deleteFormulaire,
    EditForm
  }