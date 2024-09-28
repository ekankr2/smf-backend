import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: "app", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SMF backend API",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
};