import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('DeleteTodo')

export async function handler(event) {
  try {
    logger.info('Processing deleteTodo request', { event })
    
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    
    await deleteTodo(userId, todoId)
    
    logger.info('Deleted todo successfully', { userId, todoId })
    
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  } catch (error) {
    logger.error('Error deleting todo', { error: error.message })
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not delete todo'
      })
    }
  }
}

