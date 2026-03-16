import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gharsamma E-commerce API",
      version: "1.0.0",
      description: "E-commerce API for Gharsamma online store",
      contact: {
        name: "API Support",
        email: "support@gharsamma.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.gharsamma.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
        PaginationParams: {
          type: "object",
          properties: {
            page: { type: "integer", default: 1 },
            limit: { type: "integer", default: 10 },
            sort: { type: "string" },
            order: { type: "string", enum: ["asc", "desc"] },
          },
        },
        CustomizationRequest: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            userEmail: { type: "string" },
            category: { type: "string" },
            customizationType: { type: "string" },
            productName: { type: "string" },
            description: { type: "string" },
            budget: { type: "string" },
            deadline: { type: "string", format: "date-time" },
            contactMethod: { type: "string" },
            phone: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        WishlistItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            product: { type: "object" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

const swaggerRouter = Router();

swaggerRouter.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

swaggerRouter.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
    customSiteTitle: "Gharsamma API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }),
);

export { swaggerRouter, specs };
