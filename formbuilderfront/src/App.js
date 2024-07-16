
import './App.css';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Login  from './Pages/Login';
import MainApp from './Component/Admin/MainApp';
import AdminDash from './Component/Admin/AdminDash';
import UserManagement from './Component/Admin/UserManagement/UserManagement';
import PageManagement from './Component/Admin/PageManagement/PageManagement';
import FormManagement from './Component/Admin/FormManagemet/FormManagment';
import AssignFormToPages from './Component/Admin/AsseignFormToPages';
import PageDetails from './Component/Admin/PageManagement/PageDetails';
import UserDash from './Component/User/UserDash';
import PageList from './Component/User/PageList';
import Signup from './Pages/Signup';

//import FormManagement from './Component/Admin/FormManagemet/FormManagment';
function App() {
  return (

    <Router>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/admin/*" element={<AdminDash />}>
      <Route path="mainapp" element={<MainApp />}/>
        <Route path="user-management" element={<UserManagement />} />
        <Route path="pages" element={<PageManagement />} />
        <Route path= "form" element={<FormManagement />} />
     
    
        <Route path="formpage" element={<AssignFormToPages/>}/>
       
      </Route>
      <Route path="/user/*" element ={<UserDash/>}>
        <Route path="PageList" element={<PageList/>}/>
      </Route>
      <Route path= "/pagedetail/:pageId" element={<PageDetails />} />
     
    
        
      </Routes>
     </Router>
  );
  
}

export default App;
