import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, AlertTriangle, CheckCircle, TrendingUp, History, ArrowLeft, Mail, User } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

// ========================================
// CONFIGURACIÓN Y CONSTANTES
// ========================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SECURITY_QUESTIONS = [
  {
    id: 'password',
    question: '¿Usas contraseñas únicas y fuertes para cada cuenta?',
    icon: Lock,
    options: [
      { value: 'si', label: 'Sí, siempre' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'twoFactor',
    question: '¿Tienes autenticación de dos factores activada?',
    icon: Shield,
    options: [
      { value: 'si', label: 'Sí' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'updates',
    question: '¿Actualizas regularmente tus dispositivos y aplicaciones?',
    icon: TrendingUp,
    options: [
      { value: 'siempre', label: 'Siempre' },
      { value: 'a-veces', label: 'A veces' },
      { value: 'nunca', label: 'Nunca' }
    ]
  },
  {
    id: 'publicWifi',
    question: '¿Usas redes WiFi públicas sin VPN?',
    icon: AlertTriangle,
    options: [
      { value: 'si', label: 'Sí' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'backup',
    question: '¿Realizas copias de seguridad de tus datos importantes?',
    icon: CheckCircle,
    options: [
      { value: 'si', label: 'Sí' },
      { value: 'no', label: 'No' }
    ]
  }
]

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

function App() {
  const [currentView, setCurrentView] = useState('home') // home, questionnaire, results, history
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [userData, setUserData] = useState({ name: '', email: '' })
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [evaluationHistory, setEvaluationHistory] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar historial al iniciar
  useEffect(() => {
    if (currentView === 'history') {
      fetchHistory()
    }
  }, [currentView])

  // ========================================
  // FUNCIONES DE API
  // ========================================

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/evaluations`)
      const data = await response.json()
      if (data.success) {
        setEvaluationHistory(data.data)
      }
    } catch (error) {
      console.error('Error al cargar historial:', error)
    }
  }

  const submitEvaluation = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          answers: answers
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setEvaluationResult(data.data)
        setCurrentView('results')
      } else {
        alert('Error al enviar evaluación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================

  const handleStartQuestionnaire = () => {
    if (userData.name && userData.email) {
      setCurrentView('questionnaire')
      setCurrentQuestion(0)
      setAnswers({})
    } else {
      alert('Por favor completa tu nombre y email')
    }
  }

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentQuestion < SECURITY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitEvaluation()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetApp = () => {
    setCurrentView('home')
    setCurrentQuestion(0)
    setAnswers({})
    setUserData({ name: '', email: '' })
    setEvaluationResult(null)
  }

  // ========================================
  // COMPONENTES DE UI
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-800">Security Dashboard</h1>
          </div>
          {currentView !== 'home' && (
            <button
              onClick={resetApp}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && <HomeView 
            userData={userData} 
            setUserData={setUserData}
            onStart={handleStartQuestionnaire}
            onViewHistory={() => setCurrentView('history')}
          />}
          
          {currentView === 'questionnaire' && <QuestionnaireView 
            question={SECURITY_QUESTIONS[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={SECURITY_QUESTIONS.length}
            answer={answers[SECURITY_QUESTIONS[currentQuestion].id]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
          />}
          
          {currentView === 'results' && <ResultsView 
            result={evaluationResult}
            userData={userData}
          />}
          
          {currentView === 'history' && <HistoryView 
            history={evaluationHistory}
          />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-gray-500 text-sm">
        <p>Dashboard de Seguridad Personal - Universidad Mariano Gálvez</p>
        <p className="mt-1">Maestría en Seguridad Informática</p>
      </footer>
    </div>
  )
}

// ========================================
// VISTA: HOME
// ========================================

function HomeView({ userData, setUserData, onStart, onViewHistory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Shield className="w-24 h-24 mx-auto text-primary-600" />
        </motion.div>
        <h2 className="text-4xl font-bold text-gray-800">
          Evalúa tu Seguridad Digital
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre qué tan seguro estás en el mundo digital y recibe recomendaciones personalizadas
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card max-w-md mx-auto"
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Comienza tu evaluación</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Tu nombre
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Juan Pérez"
              maxLength="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Tu email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="juan@ejemplo.com"
            />
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!userData.name || !userData.email}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comenzar Evaluación
        </button>

        <button
          onClick={onViewHistory}
          className="btn-secondary w-full mt-3"
        >
          <History className="w-5 h-5 inline mr-2" />
          Ver Historial
        </button>
      </motion.div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <FeatureCard
          icon={Shield}
          title="Evaluación Completa"
          description="5 preguntas clave sobre tus hábitos de seguridad digital"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Score Personalizado"
          description="Obtén tu puntuación de seguridad de 0 a 100"
        />
        <FeatureCard
          icon={CheckCircle}
          title="Recomendaciones"
          description="Recibe consejos específicos para mejorar tu seguridad"
        />
      </div>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card text-center"
    >
      <Icon className="w-12 h-12 mx-auto text-primary-600 mb-4" />
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

// ========================================
// VISTA: CUESTIONARIO
// ========================================

function QuestionnaireView({ question, questionNumber, totalQuestions, answer, onAnswer, onNext, onBack, loading }) {
  const Icon = question.icon
  const progress = (questionNumber / totalQuestions) * 100

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pregunta {questionNumber} de {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Icon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.id, option.value)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                answer === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-300 hover:border-primary-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.label}</span>
                {answer === option.value && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {questionNumber > 1 && (
            <button onClick={onBack} className="btn-secondary flex-1">
              Anterior
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!answer || loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : questionNumber === totalQuestions ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ========================================
// VISTA: RESULTADOS
// ========================================

function ResultsView({ result, userData }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score) => {
    if (score >= 80) return '¡Excelente! Tu seguridad digital es muy buena'
    if (score >= 50) return 'Bien, pero hay aspectos a mejorar'
    return 'Atención: Tu seguridad digital necesita mejoras urgentes'
  }

  // Datos para el gráfico de radar
  const radarData = [
    { subject: 'Contraseñas', value: result.score },
    { subject: '2FA', value: result.score },
    { subject: 'Actualizaciones', value: result.score },
    { subject: 'WiFi Público', value: 100 - result.score },
    { subject: 'Backups', value: result.score },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Score Card */}
      <div className="card text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Resultados de {userData.name}
        </h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="my-8"
        >
          <div className={`text-7xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}
          </div>
          <div className="text-2xl text-gray-600 mt-2">/ 100</div>
        </motion.div>

        <p className="text-xl text-gray-700">{getScoreMessage(result.score)}</p>

        {/* Radar Chart */}
        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#0284c7"
                fill="#0284c7"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Recomendaciones Personalizadas
          </h3>
          <div className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'alta'
                    ? 'border-red-500 bg-red-50'
                    : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                    rec.priority === 'alta' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                    <p className="text-gray-700 mt-1">{rec.description}</p>
                    <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded ${
                      rec.priority === 'alta'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      Prioridad {rec.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ========================================
// VISTA: HISTORIAL
// ========================================

function HistoryView({ history }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <History className="w-7 h-7" />
          Historial de Evaluaciones
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No hay evaluaciones previas
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((evaluation, index) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{evaluation.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(evaluation.timestamp).toLocaleString('es-GT')}
                    </p>
                  </div>
                  <div className={`text-3xl font-bold ${
                    evaluation.score >= 80 ? 'text-green-600' :
                    evaluation.score >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {evaluation.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default App