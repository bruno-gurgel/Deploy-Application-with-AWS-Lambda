import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'

const logger = createLogger('GenerateUploadUrl')

export async function handler(event) {
  try {
    logger.info('Processing generateUploadUrl request', { event })

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const result = await generateUploadUrl(userId, todoId)

    logger.info('Generated upload URL successfully', { todoId, userId })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: result.uploadUrl
      })
    }
  } catch (error) {
    logger.error('Error generating upload URL', { error: error.message })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Could not generate upload URL'
      })
    }
  }
}

