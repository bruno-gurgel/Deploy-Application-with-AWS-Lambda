import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('GetTodos')

export async function handler(event) {
  try {
    logger.info('Processing getTodos request', { event })
    
    const userId = getUserId(event)
    const todos = await getTodos(userId)
    
    logger.info('Getting todos successfully', { userId, count: todos.length })
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos
      })
    }
  } catch (error) {
    logger.error('Error getting todos', { error: error.message })
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not get todos'
      })
    }
  }
}
