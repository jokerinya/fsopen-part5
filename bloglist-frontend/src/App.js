import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [notification, setNotification] = useState({
        type: null,
        content: null,
    });

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem('loggedBlogappUser');
        if (userJSON) {
            const userObj = JSON.parse(userJSON);
            setUser(userObj);
            blogService.setToken(userObj.token);
        }
    }, []);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            blogService.setToken(user.token);
            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            );
            setUser(user);
            setUsername('');
            setPassword('');
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

    const handleCreateBlogFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const createdBlog = await blogService.create({
                title,
                author,
                url,
            });
            setTitle('');
            setAuthor('');
            setUrl('');
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

    const clearNotification = () => {
        setTimeout(() => {
            setNotification({ type: null, content: null });
        }, 5000);
    };

    const loginForm = () => (
        <div>
            <h2>log in to application</h2>
            <Notification message={notification} />
            <form onSubmit={handleLoginSubmit}>
                <div>
                    username:
                    <input
                        type='text'
                        name='username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    password:
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    );

    const blogsArea = () => (
        <div>
            <h2>blogs</h2>
            <Notification message={notification} />
            <p>
                {user.name} logged in{' '}
                <button onClick={handleLogout}>logout</button>
            </p>
            {createBlogForm()}
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );

    const createBlogForm = () => (
        <>
            <form onSubmit={handleCreateBlogFormSubmit}>
                <h2>create new</h2>
                <div>
                    title:
                    <input
                        type='text'
                        name='title'
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                    />
                </div>
                <div>
                    author:
                    <input
                        type='text'
                        name='author'
                        onChange={(event) => setAuthor(event.target.value)}
                        value={author}
                    />
                </div>
                <div>
                    url:
                    <input
                        type='text'
                        name='url'
                        onChange={(event) => setUrl(event.target.value)}
                        value={url}
                    />
                </div>
                <div>
                    <button type='submit'>create</button>
                </div>
            </form>
        </>
    );

    return <>{user === null ? loginForm() : blogsArea()}</>;
};

export default App;
