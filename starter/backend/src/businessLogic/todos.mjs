import { getAllTodos as getAllTodosFromAccess, createTodo as createTodoInAccess, updateTodo as updateTodoInAccess, deleteTodo as deleteTodoInAccess, updateAttachmentUrl as updateAttachmentUrlAccess } from '../dataLayer/todosAccess.mjs'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('TodosBusinessLogic')

export async function getTodos(userId) {
  logger.info('Getting todos for user', { userId })
  return await getAllTodosFromAccess(userId)
}

export async function createTodo(userId, todoRequest) {
  logger.info('Creating todo for user', { userId, todoRequest })
  
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()
  
  const todo = {
    todoId,
    userId,
    createdAt,
    done: false,
    attachmentUrl: null,
    ...todoRequest
  }
  
  await createTodoInAccess(todo)
  logger.info('Created todo', { todoId })
  
  return todo
}

export async function updateTodo(userId, todoId, todoUpdate) {
  logger.info('Updating todo', { userId, todoId, todoUpdate })
  return await updateTodoInAccess(userId, todoId, todoUpdate)
}

export async function deleteTodo(userId, todoId) {
  logger.info('Deleting todo', { userId, todoId })
  return await deleteTodoInAccess(userId, todoId)
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
  logger.info('Updating attachment url', { userId, todoId, attachmentUrl })
  return await updateAttachmentUrlAccess(userId, todoId, attachmentUrl)
}

export async function generateUploadUrl(userId, todoId) {
  logger.info('Generating upload URL', { userId, todoId })
  
  const bucketName = process.env.ATTACHMENT_S3_BUCKET
  
  const uploadUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await updateAttachmentUrlAccess(userId, todoId, attachmentUrl)
  
  logger.info('Generated upload URL successfully', { todoId, uploadUrl })
  
  return {
    uploadUrl,
    attachmentUrl
  }
}