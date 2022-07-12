import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
    /* States */
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({
        type: null,
        content: null,
    });
    /* Refs */
    const createFormRef = useRef();
    /* Effects */
    useEffect(() => {
        async function fetchBlogs() {
            const blogs = await blogService.getAll();
            setBlogs(blogs);
        }
        fetchBlogs();
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem('loggedBlogappUser');
        if (userJSON) {
            const userObj = JSON.parse(userJSON);
            setUser(userObj);
            blogService.setToken(userObj.token);
        }
    }, []);

    const handleLoginSubmit = async (userCredentials) => {
        try {
            const user = await loginService.login(userCredentials);
            blogService.setToken(user.token);
            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            );
            setUser(user);
        } catch (exception) {
            console.log(exception);
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            });
            clearNotification();
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser');
        setUser(null);
    };

    const handleCreateBlogFormSubmit = async (newBlogObj) => {
        try {
            const createdBlog = await blogService.create(newBlogObj);
            createFormRef.current.toggleVisibility();
            setBlogs([...blogs, createdBlog]);
            setNotification({
                type: 'success',
                content: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
            });
            clearNotification();
        } catch (exception) {
            console.log(exception);
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            });
            clearNotification();
        }
    };

    const handleBlogLike = async (updatedBlogObj) => {
        try {
            const updatedBlog = await blogService.update(updatedBlogObj);
            setBlogs(
                blogs.map((blog) =>
                    blog.id === updatedBlog.id ? updatedBlog : blog
                )
            );
        } catch (exception) {
            console.log(exception);
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            });
            clearNotification();
        }
    };

    const handleBlogDelete = async (blogId) => {
        try {
            await blogService.remove(blogId);
            setBlogs(blogs.filter((blog) => blog.id !== blogId));
        } catch (exception) {
            console.log(exception);
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            });
            clearNotification();
        }
    };

    const clearNotification = () => {
        setTimeout(() => {
            setNotification({ type: null, content: null });
        }, 5000);
    };

    // sort blogs the biggest likes number to the lowest
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

    const loginFormArea = () => (
        <div>
            <h2>log in to application</h2>
            <Notification message={notification} />
            <LoginForm onLoginFormSubmit={handleLoginSubmit} />
        </div>
    );

    const blogsArea = () => (
        <div>
            <h2>blogs</h2>
            <Notification message={notification} />
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            {createBlogFormArea()}
            {sortedBlogs.map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    user={user}
                    onBlogLike={handleBlogLike}
                    onBlogDelete={handleBlogDelete}
                />
            ))}
        </div>
    );

    const createBlogFormArea = () => (
        <>
            <Togglable buttonLabel='new note' ref={createFormRef}>
                <BlogForm onCreateBlogFormSubmit={handleCreateBlogFormSubmit} />
            </Togglable>
        </>
    );

    return <>{user === null ? loginFormArea() : blogsArea()}</>;
};

export default App;
