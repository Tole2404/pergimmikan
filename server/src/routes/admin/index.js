const express = require('express');
const router = express.Router();

// Import admin routes
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const contentRoutes = require('./content.routes');
const teamRoutes = require('./team.routes');
const journeyRoutes = require('./journey.routes');
const galleryRoutes = require('./gallery.routes');
const eventRoutes = require('./event.routes');
const legacyRoutes = require('./legacy.routes');
const quoteRoutes = require('./quote.routes');
const activityRoutes = require('./activity.routes');
const savingsRoutes = require('./savings.routes');
const roleRoutes = require('./role.routes');
const featuredJourneyRoutes = require('./featured_journey.routes');
const seoRoutes = require('./seo.routes');

// Use admin routes
router.use('/auth', authRoutes);     // /api/admin/auth/*
router.use('/users', userRoutes);    // /api/admin/users/*
router.use('/content', contentRoutes); // /api/admin/content/*
router.use('/team', teamRoutes);     // /api/admin/team/*
router.use('/journeys', journeyRoutes); // /api/admin/journeys/*
router.use('/galleries', galleryRoutes); // /api/admin/galleries/*
router.use('/events', eventRoutes);    // /api/admin/events/*
router.use('/legacies', legacyRoutes); // /api/admin/legacies/*
router.use('/quotes', quoteRoutes);   // /api/admin/quotes/*
router.use('/activities', activityRoutes); // /api/admin/activities/*
router.use('/tabungan', savingsRoutes);  // /api/admin/tabungan/*
router.use('/roles', roleRoutes);     // /api/admin/roles/*
router.use('/featured-journeys', featuredJourneyRoutes); // /api/admin/featured-journeys/*
router.use('/seo', seoRoutes);       // /api/admin/seo/*

module.exports = router;
