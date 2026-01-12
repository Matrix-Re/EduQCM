import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduQCM API",
      version: "1.0.0",
      description: "EduQCM API Documentation",
    },
    servers: [
      {
        url: process.env.API_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Tous les fichiers où Swagger va lire les annotations
  apis: ["./src/modules/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
