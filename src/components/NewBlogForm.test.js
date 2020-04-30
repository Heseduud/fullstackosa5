import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

test('callback function from props is called with right info', () => {
  const mockCreate = jest.fn()

  const component = render(<NewBlogForm createBlog={mockCreate}/>)
  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, { target: { value: 'Testing blogs' } })
  fireEvent.change(author, { target: { value: 'Artu Hellus' } })
  fireEvent.change(url, { target: { value: 'www.example.com' } })

  fireEvent.submit(form)

  expect(mockCreate.mock.calls).toHaveLength(1)
  expect(mockCreate.mock.calls[0][0].title).toBe('Testing blogs')
  expect(mockCreate.mock.calls[0][0].author).toBe('Artu Hellus')
  expect(mockCreate.mock.calls[0][0].url).toBe('www.example.com')
})