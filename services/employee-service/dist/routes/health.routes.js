"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
router.get('/', health_controller_1.healthCheck);
router.get('/db', health_controller_1.databaseHealthCheck);
router.get('/full', health_controller_1.fullHealthCheck);
exports.default = router;
//# sourceMappingURL=health.routes.js.map