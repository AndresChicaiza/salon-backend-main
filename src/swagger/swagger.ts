export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Salón de Estudio Colaborativo — API',
        version: '1.0.0',
        description: 'Documentación de la API REST del backend principal',
    },
    servers: [
        { url: 'http://localhost:4000', description: 'Desarrollo local' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token de Firebase Authentication',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    uid: { type: 'string', example: 'abc123uid' },
                    email: { type: 'string', example: 'juan@ejemplo.com' },
                    username: { type: 'string', example: 'juanperez123' },
                    displayName: { type: 'string', example: 'Juan Pérez' },
                    avatarUrl: { type: 'string', example: 'https://ejemplo.com/avatar.jpg' },
                    createdAt: { type: 'string', example: '2026-05-09T00:00:00.000Z' },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Mensaje de error' },
                },
            },
        },
    },
    paths: {
        '/users/check-username/{username}': {
            get: {
                summary: 'Verificar disponibilidad de username',
                tags: ['Usuarios'],
                parameters: [
                    {
                        name: 'username',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        example: 'juanperez123',
                    },
                ],
                responses: {
                    200: {
                        description: 'Disponibilidad del username',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        available: { type: 'boolean', example: true },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/users': {
            post: {
                summary: 'Crear perfil de usuario en Firestore',
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'displayName'],
                                properties: {
                                    username: { type: 'string', example: 'juanperez123' },
                                    displayName: { type: 'string', example: 'Juan Pérez' },
                                    avatarUrl: { type: 'string', example: 'https://ejemplo.com/avatar.jpg' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Perfil creado exitosamente' },
                    400: { description: 'Datos inválidos' },
                    401: { description: 'Token inválido' },
                    409: { description: 'Username ya en uso' },
                },
            },
            get: {
                summary: 'Obtener perfil del usuario autenticado',
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Perfil del usuario',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                    401: { description: 'Token inválido' },
                    404: { description: 'Perfil no encontrado' },
                },
            },
            put: {
                summary: 'Actualizar perfil del usuario autenticado',
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    displayName: { type: 'string' },
                                    avatarUrl: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Perfil actualizado' },
                    401: { description: 'Token inválido' },
                    409: { description: 'Username ya en uso' },
                },
            },
            delete: {
                summary: 'Eliminar cuenta del usuario autenticado',
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Cuenta eliminada exitosamente' },
                    401: { description: 'Token inválido' },
                },
            },
        },
        '/health': {
            get: {
                summary: 'Verificar estado del servidor',
                tags: ['Sistema'],
                responses: {
                    200: {
                        description: 'Servidor operativo',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                        service: { type: 'string', example: 'backend-main' },
                                        timestamp: { type: 'string', example: '2026-05-09T00:00:00.000Z' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
}