import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    // create mock data, user and function
    const mockFormData = {
        title: 'A mock data for testing',
        author: 'Ibrahim Sakaci',
        url: 'https://github.com/jokerinya',
    };
    const createNewBlog = jest.fn();
    const user = userEvent.setup();

    // render component
    const { container } = render(
        <BlogForm onCreateBlogFormSubmit={createNewBlog} />
    );

    // get elements
    const titleInput = container.querySelector('[name=title]');
    const authorInput = container.querySelector('[name=author]');
    const urlInput = container.querySelector('[name=url]');

    const submitButton = screen.getByText('create');

    // type mock info to the elements
    await user.type(titleInput, mockFormData.title);
    await user.type(authorInput, mockFormData.author);
    await user.type(urlInput, mockFormData.url);
    await user.click(submitButton);

    // expect results
    expect(createNewBlog.mock.calls).toHaveLength(1);
    expect(createNewBlog.mock.calls[0][0].title).toBe(mockFormData.title);
    expect(createNewBlog.mock.calls[0][0].author).toBe(mockFormData.author);
    expect(createNewBlog.mock.calls[0][0].url).toBe(mockFormData.url);
});
