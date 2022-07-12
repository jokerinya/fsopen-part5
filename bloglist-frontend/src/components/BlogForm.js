import React, { useState } from 'react';

const BlogForm = ({ onCreateBlogFormSubmit }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleCreateBlogFormSubmit = (event) => {
        event.preventDefault();
        onCreateBlogFormSubmit({ title, author, url });
        setTitle('');
        setAuthor('');
        setUrl('');
    };

    return (
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
    );
};

export default BlogForm;
