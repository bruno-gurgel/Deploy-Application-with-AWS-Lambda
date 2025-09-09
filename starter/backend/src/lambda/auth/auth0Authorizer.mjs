import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-7v57uhoi5x8xq2wa.us.auth0.com/.well-known/jwks.json'


export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User was authorized', {
      token: jwtToken
    })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })


  if (!jwt || !jwt.header || !jwt.header.kid) {
    throw new Error('Invalid token')
  }

  const signingKey = await getSigningKey(jwt.header.kid)
  return jsonwebtoken.verify(token, signingKey, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getSigningKey(kid) {
  logger.info('Fetching JWKS from Auth0')
  const response = await Axios.get(jwksUrl)

  const key = response.data.keys.find(k => k.kid === kid)
  if (!key) {
    throw new Error(`Unable to find a signing key that matches '${kid}'`)
  }

  // Convert JWK to PEM format
  const cert = key.x5c[0]
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`
}
