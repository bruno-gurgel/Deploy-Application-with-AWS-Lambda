import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('TodosAccess')

const dynamoDb = new DynamoDB()
const dynamoDbXray = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDBClient = DynamoDBDocument.from(dynamoDbXray)

const todosTable = process.env.TODOS_TABLE
const IMAGES_S3_BUCKET = process.env.IMAGES_S3_BUCKET

export async function getAllTodos(userId) {
  logger.info('Getting all todos for user', { userId })

  const result = await dynamoDBClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })

  logger.info('Retrieved todos', { count: result.Items.length })
  return result.Items
}

export async function createTodo(todo) {
  logger.info('Creating todo', { todoId: todo.todoId })

  await dynamoDBClient.put({
    TableName: todosTable,
    Item: todo
  })

  logger.info('Todo created successfully', { todoId: todo.todoId })
}

export async function updateTodo(userId, todoId, todoUpdate) {
  logger.info('Updating todo', { userId, todoId, todoUpdate })

  await dynamoDBClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'SET #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done'
    },
    ExpressionAttributeValues: {
      ':name': todoUpdate.name,
      ':dueDate': todoUpdate.dueDate,
      ':done': todoUpdate.done
    },
    ReturnValues: "UPDATED_NEW"
  })

  logger.info('Todo updated successfully', { todoId })
}

export async function deleteTodo(userId, todoId) {
  logger.info('Deleting todo', { userId, todoId })

  await dynamoDBClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  })

  logger.info('Todo deleted successfully', { todoId })
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
  logger.info('Updating attachment URL', { userId, todoId, attachmentUrl })

  await dynamoDBClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  })

  logger.info('Attachment URL updated successfully', { todoId })
}