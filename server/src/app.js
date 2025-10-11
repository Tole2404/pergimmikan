const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const expressListEndpoints = require('express-list-endpoints');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();


// Import routes and models
const Next = require('./models/next.model');
const authRoutes = require('./routes/auth.routes');
const teamAuthRoutes = require('./routes/team/auth.routes');
const adminRoutes = require('./routes/admin');
const eventsRoutes = require('./routes/events.routes');
const legaciesRoutes = require('./routes/legacies.routes');
const quotesRoutes = require('./routes/quotes.routes');
const activitiesRoutes = require('./routes/activities.routes');
const galleriesRoutes = require('./routes/galleries.routes');
const journeysRoutes = require('./routes/journeys.routes');
const teamRoutes = require('./routes/team.routes');
const nextRoutes = require('./routes/next.routes');
const savingsRoutes = require('./routes/savings.routes');
const nextAdminRoutes = require('./routes/admin/next.routes');
const featuredJourneysRoutes = require('./routes/featured_journeys.routes');
const apiKeysRoutes = require('./routes/api_keys.routes');
const verifyApiKeyRoutes = require('./routes/verify_api_key.routes');
const telegramRoutes = require('./routes/telegram.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const commentsRoutes = require('./routes/comments.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.timeout = 300000; 

const uploadDirs = [
  path.join(__dirname, '../public/images/team'),
  path.join(__dirname, '../public/images/journey'),
  path.join(__dirname, '../public/images/gallery'),
  path.join(__dirname, '../public/images/activities'),
  path.join(__dirname, '../public/images/activities/gallery'),
  path.join(__dirname, '../public/images/profiles'),
  path.join(__dirname, '../public/images/next'),
  path.join(__dirname, '../public/images/receipts')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log(expressListEndpoints(app));

app.use(compression()); 
app.use(helmet());

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://pergimmikan.site', 'https://www.pergimmikan.site', 'https://apiv1.pergimmikan.site', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '3600'); 
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/images', express.static(path.join(__dirname, '../public/images'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath, stat) => {
    const origin = res.req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
    } else {
      // Fallback untuk development
      res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
        ? 'https://pergimmikan.site' 
        : 'http://localhost:5173');
    }
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Cache-Control', 'public, max-age=86400'); 
  }
}));

// Public API routes
app.use('/api/auth', authRoutes);
app.use('/api/team/auth', teamAuthRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/legacies', legaciesRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/galleries', galleriesRoutes);
app.use('/api/journeys', journeysRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/next', nextRoutes);
app.use('/api/tabungan', savingsRoutes);
app.use('/api/featured-journeys', featuredJourneysRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/telegram', telegramRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/next', nextAdminRoutes);
app.use('/api/admin/api-keys', apiKeysRoutes);

// API Key verification route
app.use('/api/verify-api-key', verifyApiKeyRoutes);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PERGIMMIKAN API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk platform PERGIMMIKAN - Platform untuk mengabadikan kenangan bersama teman kuliah selama 4 tahun',
      contact: {
        name: 'Tim PERGIMMIKAN',
        url: 'https://pergimmikan.site',
      },
    },
    servers: [
      {
        url: 'https://apiv1.pergimmikan.site',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-KEY',
          description: 'API key untuk mengakses API PERGIMMIKAN',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './src/routes/*.js', 
    './src/models/*.js', 
    './src/swagger/*.js',
    './src/swagger/auth.js',
    './src/swagger/admin_auth.js',
    './src/swagger/team.js',
    './src/swagger/activities.js',
    './src/swagger/galleries.js',
    './src/swagger/journeys.js',
    './src/swagger/savings.js',
    './src/swagger/quotes.js',
    './src/swagger/legacies.js',
    './src/swagger/events.js',
    './src/swagger/users.js',
    './src/swagger/photos.js',
    './src/swagger/featured_journeys.js',
    './src/swagger/api_keys.js',
    './src/swagger/admin_savings.js',
    './src/swagger/index.js'
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PERGIMMIKAN API Documentation',
}));

app.get('/api/routes', (req, res) => {
  const routes = expressListEndpoints(app);
  
  const formattedRoutes = routes.map(route => ({
    path: route.path,
    methods: route.methods,
    middlewares: route.middlewares.map(m => m.name || 'anonymous')
  }));
  
  res.json({
    totalRoutes: formattedRoutes.length,
    routes: formattedRoutes
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Import API key controller untuk inisialisasi tabel
const apiKeyController = require('./controllers/api_key.controller');

if (require.main === module) {
  Next.runMigrations()
    .then(() => {
      // Inisialisasi tabel API key
      return apiKeyController.initApiKeyTable();
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(error => {
      console.error('Failed to run migrations:', error);
      process.exit(1);
    });
}

module.exports = app;
