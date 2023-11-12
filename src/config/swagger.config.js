export default {
	swaggerDefinition: {
		openapi: "3.0.3",
		info: {
			title: "Nubidesk-Microservices-API",
			version: "1.0.0",
			description: "The API documentation of Nubidesk Microservices RESTful APIs using Node.js, Express, and Mongoose.",
		},
		basePath: "/api",
		servers: [
			{
				...(process.env.NODE_ENV == "development" && {
					url: "http://localhost:3033/api/",
				}),
				...(process.env.NODE_ENV == "staging" && {
					url: "https://api-nubidesk.nubitel.co/",
				}),
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
				LanguageAuth: {
					type: "apiKey",
					name: "x-nubitel-language",
					in: "header",
				},
				TenantAuth: {
					type: "apiKey",
					name: "x-nubitel-tenant",
					in: "header",
				},
			},
		},
		security: [
			{
				LanguageAuth: [],
			},
			{
				TenantAuth: [],
			},
		],
	},
	apis: ["src/models/*.js", "src/utils/helpers/*.js", "src/api/controllers/*/*.js", "src/api/controllers/*/*/*.js"],
	// apis: ["src/models/*.js", "src/utils/helpers/*.js", "src/api/controllers/user/*.js", "src/api/controllers/user/edit/*.js", "src/api/controllers/user/auth/*.js"],
};
