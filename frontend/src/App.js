import {Routes,Route} from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import ArticleDetailPage from './pages/articleDetail/ArticleDetailPage';
import RegisterPage from './pages/register/RegisterPage';
import {Toaster} from 'react-hot-toast';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import Admin from './pages/admin/screens/Admin';
import Comments from './pages/admin/screens/Comments';
import ManagePosts from './pages/admin/screens/ManagePosts';
import EditPost from './pages/admin/screens/EditPost';
import Categories from './pages/admin/screens/categories/Categories';
import EditCategories from './pages/admin/screens/categories/EditCategories';
import Users from './pages/admin/screens/users/Users';
import BlogPage from './pages/blog/BlogPage';

function App() {
  return (
    <div className="App font-opensans">
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="/blog/:slug" element={<ArticleDetailPage/>}/>
        <Route path="/blog" element={<BlogPage/>}/>
        <Route index path="/register" element={<RegisterPage/>}/>
        <Route index path="/login" element={<LoginPage/>}/>
        <Route index path="/profile" element={<ProfilePage/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Admin/>}/>
          <Route path="/admin/comments" element={<Comments/>}/>
          <Route path="/admin/posts/manage" element={<ManagePosts/>}/>
          <Route path="/admin/posts/manage/edit/:slug" element={<EditPost/>}/>
          <Route path="/admin/categories/manage" element={<Categories/>}/>
          <Route path="/admin/categories/manage/edit/:slug" element={<EditCategories/>}/>
          <Route path="/admin/users/manage" element={<Users/>}/>
        </Route>
      </Routes>
      <Toaster/>
      </div>
  );
}

export default App;
