const swaggerJsDoc = require('swagger-jsdoc');
const swaggerAutogen = require('swagger-autogen')

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Traça',
            version: '1.0.0',
            description: 'Documentation using Swagger for the Social Reading App API',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'development server'

            },
            {
                url: 'https://api-traca.vercel.app/api',
                description: 'production server'

            },
        ],
    },
    apis: ['src/routes/*.ts'],
};


//const outputFile = './swagger.json'; // Caminho do arquivo de saída
//const endpointsFiles = ['src/routes/*.ts', 'prisma/schema.prisma']

//swaggerAutogen(outputFile, endpointsFiles, options)

const swaggerDocs = swaggerJsDoc(options);


export default swaggerDocs