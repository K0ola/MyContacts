const swaggerUi = require('swagger-ui-express');

function initSwagger(app) {
  const serverUrl = 'http://localhost:3000';

  const openapiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'MyCOntacts',
      description:
        'API de répertoire.<br/>'
    },
    servers: [{ url: serverUrl }],
    tags: [
      { name: 'Auth', description: 'Inscription & connexion' },
      { name: 'Contacts', description: 'Gestion logique contact' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectId' },
            email: { type: 'string', format: 'email' },
          },
          required: ['id', 'email'],
        },
        RegisterInput: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'john.doe@exemplechef.com' },
            password: { type: 'string', minLength: 6, example: 'cecinestpasunmotdepasse' },
          },
          required: ['email', 'password'],
        },
        LoginInput: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'john.doe@exemplechef.com' },
            password: { type: 'string', example: 'cecinestpasunmotdepasse' },
          },
          required: ['email', 'password'],
        },
        AuthSuccess: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            id: { type: 'string', format: 'objectId' },
            email: { type: 'string', format: 'email' },
            token: { type: 'string', description: 'JWT' },
          },
          required: ['id', 'email', 'token'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        Contact: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'objectId' },
            userId: { type: 'string', format: 'objectId' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+33601020304' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['firstName', 'lastName', 'phone'],
        },
        ContactInput: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+33601020304' },
          },
          required: ['firstName', 'lastName', 'phone'],
        },
        ContactList: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/Contact' },
            },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
      },
    },
    paths: {
      // Auth
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Créer un compte',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
            },
          },
          responses: {
            '201': {
              description: 'Utilisateur créé',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      token: { type: 'string' },
                    },
                    required: ['id', 'email', 'token'],
                  },
                },
              },
            },
            '400': { description: 'Entrée invalide', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '409': { description: 'Email déjà utilisé', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Se connecter',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
            },
          },
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthSuccess' } } } },
            '401': { description: 'Identifiants invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },

      // COntacts
      '/contacts': {
        get: {
          tags: ['Contacts'],
          summary: 'Lister les contacts (recherche/pagination/tri)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Recherche sur firstName/lastName/phone' },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
            { name: 'sort', in: 'query', schema: { type: 'string', example: 'lastName:asc' }, description: 'ex: lastName:asc, createdAt:desc' },
          ],
          responses: {
            '200': {
              description: 'Liste paginée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactList' } } },
            },
            '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        post: {
          tags: ['Contacts'],
          summary: 'Créer un contact',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactInput' } } },
          },
          responses: {
            '201': { description: 'Créé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
            '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '409': { description: 'Conflit (numéro déjà utilisé pour ce user si index unique)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/contacts/{id}': {
        get: {
          tags: ['Contacts'],
          summary: 'Récupérer un contact par ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
            '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '404': { description: 'Introuvable', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        put: {
          tags: ['Contacts'],
          summary: 'Mettre à jour un contact',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactInput' } } },
          },
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
            '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '404': { description: 'Introuvable', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '409': { description: 'Conflit', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Contacts'],
          summary: 'Supprimer un contact',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'Supprimé',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { message: { type: 'string', example: 'Contact supprimé' } },
                  },
                },
              },
            },
            '401': { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '404': { description: 'Introuvable', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
    },
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));

  app.get('/docs.json', (_, res) => res.json(openapiSpec));

  console.log(`Swagger good (server: ${serverUrl})`);
}

module.exports = { initSwagger };
