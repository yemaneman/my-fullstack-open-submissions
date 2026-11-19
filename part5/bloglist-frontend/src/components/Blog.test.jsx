import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './blogForm'
describe('<Blog />', () => {
  let blog
  let handleLike

  beforeEach(() => {
    blog = {
      title: 'Testing React components with Vitest',
      author: 'Dan Abramov',
      url: 'https://example.com/testing-react',
      likes: 5,
      user: {
        username: 'ymiesho',
        name: 'Yemane Miesho',
      },
    }
    handleLike = vi.fn()

    render(<Blog blog={blog} handleLike={handleLike} />)
  })

  test('renders title and author, but does not render url or likes by default', () => {
    expect(screen.getByText(/Testing React components with Vitest/i)).toBeInTheDocument()
    expect(screen.getByText(/Dan Abramov/i)).toBeInTheDocument()

    expect(screen.queryByText(/https:\/\/example\.com\/testing-react/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Likes:/i)).not.toBeInTheDocument()
  })

  test('displays url, likes, and user when the show details button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /view|show/i })
    await user.click(button)

    expect(screen.getByText(/https:\/\/example\.com\/testing-react/i)).toBeInTheDocument()
    expect(screen.getByText(/Likes:\s*5/i)).toBeInTheDocument()

    const matchingNames = screen.getAllByText(/Dan Abramov/i)
    expect(matchingNames.length).toBeGreaterThanOrEqual(2)
  })

  test('calls the like event handler twice when the like button is clicked twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByRole('button', { name: /view|show/i })
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: /^like$/i })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)
  })
})
describe('<BlogForm />', () => {
  test('calls createBlog with the right details when a new blog is submitted', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText(/write the title/i)
    const authorInput = screen.getByPlaceholderText(/write the author/i)
    const urlInput = screen.getByPlaceholderText(/write the url/i)
    const createButton = screen.getByRole('button', { name: /create|save/i })

    await user.type(titleInput, 'Testing forms in React')
    await user.type(authorInput, 'Yemane Miesho')
    await user.type(urlInput, 'https://example.com/forms')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing forms in React',
      author: 'Yemane Miesho',
      url: 'https://example.com/forms',
    })
  })
})