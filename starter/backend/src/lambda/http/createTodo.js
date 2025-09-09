import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('CreateTodo')

export async function handler(event) {
  try {
    logger.info('Processing createTodo request', { event })
    
    const userId = getUserId(event)
    const todoRequest = JSON.parse(event.body)
    
    const newTodo = await createTodo(userId, todoRequest)
    
    logger.info('Created todo successfully', { todoId: newTodo.todoId })
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newTodo
      })
    }
  } catch (error) {
    logger.error('Error creating todo', { error: error.message })
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not create todo'
      })
    }
  }
}
