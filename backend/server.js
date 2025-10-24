// ========================================
// SERVIDOR EXPRESS CON MEDIDAS DE SEGURIDAD
// ========================================

const express = require('express');
const helmet = require('helmet'); // Seguridad: Headers HTTP seguros
const cors = require('cors'); // Seguridad: Control de CORS
const rateLimit = require('express-rate-limit'); // Seguridad: Rate limiting
const { body, validationResult } = require('express-validator'); // Seguridad: Validación de inputs
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// CONFIGURACIÓN DE SEGURIDAD
// ========================================

// 1. Helmet: Agrega headers de seguridad HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// 2. CORS: Solo permite requests del frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate Limiting: Previene ataques de fuerza bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 requests por IP
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// 4. Body parser con límite de tamaño (previene ataques DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ========================================
// DIRECTORIO DE DATOS
// ========================================

const DATA_DIR = path.join(__dirname, 'data');

// Crear directorio de datos si no existe
async function initializeDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Sanitizar inputs (previene XSS)
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[<>]/g, '') // Elimina < y >
        .trim()
        .substring(0, 500); // Límite de caracteres
}

// Calcular score de seguridad
function calculateSecurityScore(answers) {
    let score = 0;
    const maxScore = Object.keys(answers).length * 10;
    
    Object.values(answers).forEach(answer => {
        if (answer === 'si' || answer === 'siempre') score += 10;
        else if (answer === 'a-veces') score += 5;
    });
    
    return Math.round((score / maxScore) * 100);
}

// Generar recomendaciones basadas en respuestas
function generateRecommendations(answers) {
    const recommendations = [];
    
    if (answers.password !== 'si') {
        recommendations.push({
            title: 'Contraseñas Débiles',
            description: 'Usa contraseñas únicas y fuertes para cada cuenta.',
            priority: 'alta'
        });
    }
    
    if (answers.twoFactor !== 'si') {
        recommendations.push({
            title: 'Autenticación de Dos Factores',
            description: 'Activa 2FA en todas tus cuentas importantes.',
            priority: 'alta'
        });
    }
    
    if (answers.updates !== 'siempre') {
        recommendations.push({
            title: 'Actualizaciones Pendientes',
            description: 'Mantén tu sistema y aplicaciones siempre actualizadas.',
            priority: 'media'
        });
    }
    
    if (answers.publicWifi === 'si') {
        recommendations.push({
            title: 'Redes WiFi Públicas',
            description: 'Evita WiFi público o usa VPN para proteger tus datos.',
            priority: 'media'
        });
    }
    
    if (answers.backup !== 'si') {
        recommendations.push({
            title: 'Copias de Seguridad',
            description: 'Realiza backups regulares de tu información importante.',
            priority: 'media'
        });
    }
    
    return recommendations;
}

// ========================================
// LOGGING DE SEGURIDAD
// ========================================

function logSecurityEvent(event, details) {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} - ${event}:`, details);
    
    // En producción, aquí enviarías logs a un servicio de monitoreo
}

// ========================================
// RUTAS DE LA API
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// POST: Evaluar seguridad
app.post('/api/evaluate',
    // Validación de inputs (Seguridad)
    [
        body('name').trim().isLength({ min: 2, max: 50 }).escape(),
        body('email').isEmail().normalizeEmail(),
        body('answers').isObject(),
        body('answers.password').isIn(['si', 'no']),
        body('answers.twoFactor').isIn(['si', 'no']),
        body('answers.updates').isIn(['siempre', 'a-veces', 'nunca']),
        body('answers.publicWifi').isIn(['si', 'no']),
        body('answers.backup').isIn(['si', 'no']),
    ],
    async (req, res) => {
        try {
            // Validar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logSecurityEvent('VALIDATION_ERROR', { errors: errors.array() });
                return res.status(400).json({ errors: errors.array() });
            }

            // Sanitizar inputs
            const name = sanitizeInput(req.body.name);
            const email = sanitizeInput(req.body.email);
            const answers = req.body.answers;

            // Calcular score y recomendaciones
            const score = calculateSecurityScore(answers);
            const recommendations = generateRecommendations(answers);

            // Crear resultado
            const evaluation = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                name,
                email,
                score,
                recommendations,
                answers
            };

            // Guardar en archivo JSON
            const filename = `evaluation_${evaluation.id}.json`;
            await fs.writeFile(
                path.join(DATA_DIR, filename),
                JSON.stringify(evaluation, null, 2)
            );

            logSecurityEvent('EVALUATION_CREATED', { id: evaluation.id, score });

            res.json({
                success: true,
                data: {
                    id: evaluation.id,
                    score,
                    recommendations
                }
            });

        } catch (error) {
            logSecurityEvent('SERVER_ERROR', { error: error.message });
            res.status(500).json({ 
                success: false, 
                message: 'Error al procesar la evaluación' 
            });
        }
    }
);

// GET: Obtener historial de evaluaciones
app.get('/api/evaluations', async (req, res) => {
    try {
        const files = await fs.readdir(DATA_DIR);
        const evaluations = [];

        for (const file of files) {
            if (file.startsWith('evaluation_') && file.endsWith('.json')) {
                const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
                const evaluation = JSON.parse(content);
                evaluations.push({
                    id: evaluation.id,
                    timestamp: evaluation.timestamp,
                    name: evaluation.name,
                    score: evaluation.score
                });
            }
        }

        // Ordenar por fecha (más reciente primero)
        evaluations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            success: true,
            data: evaluations
        });

    } catch (error) {
        logSecurityEvent('SERVER_ERROR', { error: error.message });
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener evaluaciones' 
        });
    }
});

// GET: Obtener evaluación específica
app.get('/api/evaluations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filename = `evaluation_${id}.json`;
        const filepath = path.join(DATA_DIR, filename);

        const content = await fs.readFile(filepath, 'utf-8');
        const evaluation = JSON.parse(content);

        res.json({
            success: true,
            data: evaluation
        });

    } catch (error) {
        res.status(404).json({ 
            success: false, 
            message: 'Evaluación no encontrada' 
        });
    }
});

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    logSecurityEvent('UNHANDLED_ERROR', { error: err.message });
    res.status(500).json({ message: 'Error interno del servidor' });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

async function startServer() {
    await initializeDataDir();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`🔒 Medidas de seguridad activas`);
        console.log(`📁 Directorio de datos: ${DATA_DIR}`);
    });
}

startServer();