import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('UpdateTodo')

export async function handler(event) {
  try {
    logger.info('Processing updateTodo request', { event })

    const todoId = event.pathParameters.todoId
    const todo = JSON.parse(event.body)
    const userId = getUserId(event)

    const updatedTodo = await updateTodo(userId, todoId, todo)

    logger.info('Updated todo successfully', { updatedTodo })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: updatedTodo
      })
    }
  } catch (error) {
    logger.error('Error updating todo', { error: error.message })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not update todo'
      })
    }
  }


}