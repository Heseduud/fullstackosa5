import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const testBlog = {
  title: 'Test',
  author: 'Tester',
  url: 'www.example.com',
  likes: 0,
  user: {
    id: 0,
    username: 'ArtoHellas123',
    name: 'Arto Hellas'
  }
}

const mockUser = {
  id: 0,
  username: 'ArtoHellas123',
  name: 'Arto Hellas'
}

test ('renders right things w/o show pressed', () => {
  const component = render (<Blog blog={testBlog}/>)

  expect(component.container).toHaveTextContent('Test')
  expect(component.container).toHaveTextContent('Tester')
  expect(component.container).not.toHaveTextContent('www.example.com')
  expect(component.container).not.toHaveTextContent('0')
})

test('renders right things with show pressed', () => {
  const component = render (<Blog blog={testBlog} currentUser={mockUser}/>)
  const button = component.getByText('Show')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent('Test')
  expect(component.container).toHaveTextContent('Tester')
  expect(component.container).toHaveTextContent('www.example.com')
  expect(component.container).toHaveTextContent('0')
})

test('likeHandler works properly', () => {
  const mockHandler = jest.fn()

  const component = render (<Blog blog={testBlog}
    currentUser={mockUser}
    likeHandler={mockHandler}
  />)

  const showButton = component.getByText('Show')
  fireEvent.click(showButton)

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})