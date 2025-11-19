import { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Badge,
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const USER_API_BASE_URL = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5005'

let historyFetchedThisPage = false

function useSession() {
  const [usercode, setUsercode] = useState(() => localStorage.getItem('usercode') || '')
  const [role, setRole] = useState(() => localStorage.getItem('role') || '')

  const loggedIn = !!role && (role === 'user' || !!usercode)

  const login = (uc, r) => {
    localStorage.setItem('usercode', uc)
    localStorage.setItem('role', r)
    setUsercode(uc)
    setRole(r)
    historyFetchedThisPage = false
    sessionStorage.removeItem(`historyFetched:${uc}`)
  }

  const logout = () => {
    const uc = localStorage.getItem('usercode')
    localStorage.removeItem('usercode')
    localStorage.removeItem('role')
    if (uc) sessionStorage.removeItem(`historyFetched:${uc}`)
    setUsercode('')
    setRole('')
    historyFetchedThisPage = false
  }

  return { usercode, role, loggedIn, login, logout }
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState('')
  const [usercode, setUsercode] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!role) newErrors.role = 'Please select a role'
    if (role !== 'user' && !usercode.trim()) newErrors.usercode = 'Please enter user id'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    onLogin(role === 'user' ? '' : usercode.trim(), role)
    navigate('/chat', { replace: true })
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              }}
            >
              <BotIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your workspace
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              margin="normal"
              error={!!errors.role}
              helperText={errors.role}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: 2,
                  },
                },
              }}
            >
              <MenuItem value="depot">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}>D</Typography>
                  </Box>
                  Depot
                </Box>
              </MenuItem>
              <MenuItem value="distillery">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}>D</Typography>
                  </Box>
                  Distillery
                </Box>
              </MenuItem>
              <MenuItem value="user">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}>U</Typography>
                  </Box>
                  User
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="User ID"
              placeholder="Enter your user code"
              value={usercode}
              onChange={(e) => setUsercode(e.target.value)}
              margin="normal"
              disabled={role === 'user'}
              error={!!errors.usercode && role !== 'user'}
              helperText={role === 'user' ? 'Not required for User' : errors.usercode}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              Continue to Chat
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Chip label="Secure Login" size="small" />
          </Divider>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Your session is encrypted and secure
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

function ChatTopBar({ usercode, role, onLogout, messageCount }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    const ok = window.confirm('Log out from this session?')
    if (!ok) return
    onLogout()
    navigate('/login', { replace: true })
  }

  const getRoleConfig = () => {
    if (role === 'depot') {
      return { color: '#10b981', bg: '#d1fae5', label: 'Depot' }
    }
    if (role === 'user') {
      return { color: '#3b82f6', bg: '#dbeafe', label: 'User' }
    }
    return { color: '#f59e0b', bg: '#fef3c7', label: 'Distillery' }
  }

  const roleConfig = getRoleConfig()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BotIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              AI Assistant
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {usercode && (
                <Chip
                  icon={<PersonIcon sx={{ fontSize: 14, color: roleConfig.color }} />}
                  label={usercode}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    color: '#1e293b',
                    fontWeight: 600,
                    height: 24,
                  }}
                />
              )}
              <Chip
                label={roleConfig.label}
                size="small"
                sx={{
                  bgcolor: roleConfig.bg,
                  color: roleConfig.color,
                  fontWeight: 600,
                  height: 24,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <Badge badgeContent={messageCount} color="error">
            <IconButton
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Badge> */}

          <IconButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

function toMessageItems(historyRows) {
  const items = []
  for (const row of historyRows) {
    if (row.message) {
      items.push({ id: `${row.created_at}-u`, role: 'user', content: row.message, ts: row.created_at })
    }
    if (row.response) {
      items.push({ id: `${row.created_at}-a`, role: 'assistant', content: row.response, ts: row.created_at })
    }
  }
  return items
}

function ChatPage({ usercode, role,logout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  const api5000 = useMemo(() => axios.create({ baseURL: API_BASE_URL, timeout: 30000 }), [])
  const api5005 = useMemo(() => axios.create({ baseURL: USER_API_BASE_URL, timeout: 30000 }), [])

  useEffect(() => {
    if (role === 'user') return
    if (historyFetchedThisPage) return
    historyFetchedThisPage = true

    const fetchHistory = async () => {
      try {
        const res = await api5000.get(`/analyze/history/${encodeURIComponent(usercode)}`)
        const rows = res.data?.history || []
        if (rows.length === 0) {
          setMessages([
            {
              id: 'empty',
              role: 'system',
              content: 'No previous conversations. Start a new conversation!',
              ts: new Date().toISOString(),
            },
          ])
        } else {
          setMessages(toMessageItems(rows))
        }
      } catch (e) {
        setError('Failed to load history')
      }
    }

    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, usercode])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  const sendMessage = async () => {
    const q = input.trim()
    if (!q || loading) return

    const userMsg = { id: `${Date.now()}-u`, role: 'user', content: q, ts: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      let res
      if (role === 'user') {
        res = await api5005.post('/userquery', { query: q })
      } else {
        res = await api5000.post('/analyze', { query: q, usercode, role })
      }
      const answer = res?.data?.response ?? res?.data?.answer ?? res?.data?.result ?? res?.data?.message ?? (typeof res?.data === 'string' ? res.data : 'No response')
      const aiMsg = { id: `${Date.now()}-a`, role: 'assistant', content: answer, ts: new Date().toISOString() }
      setMessages((m) => [...m, aiMsg])
    } catch (e) {
      const msg = e.response?.data?.error || e.message || 'Request failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else if (e.key === 'Escape') {
      setInput('')
    }
  }

  const clearInput = () => setInput('')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', bgcolor: '#f8fafc' }}>
      <ChatTopBar usercode={usercode} role={role} onLogout={logout} messageCount={messages.length} />

      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          height:'calc(100vh - 105px)'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Messages Area */}
          <Box
            ref={listRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <List sx={{ width: '100%' }}>
              {messages.map((m) => (
                <ListItem key={m.id} alignItems="flex-start" sx={{ px: 0, mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      gap: 2,
                      alignItems: 'flex-start',
                      flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    {m.role === 'assistant' ? (
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: 40,
                          height: 40,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        <BotIcon />
                      </Avatar>
                    ) : m.role === 'user' ? (
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          width: 40,
                          height: 40,
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: '#94a3b8', width: 40, height: 40 }}>i</Avatar>
                    )}

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        borderRadius: 3,
                        bgcolor: m.role === 'user' ? '#eff6ff' : 'white',
                        border: '1px solid',
                        borderColor: m.role === 'user' ? '#dbeafe' : '#e2e8f0',
                        boxShadow: m.role === 'user' ? '0 2px 8px rgba(59, 130, 246, 0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          sx: {
                            whiteSpace: 'pre-wrap',
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: '#1e293b',
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: { fontSize: 12, color: '#64748b', mt: 1 },
                        }}
                        primary={m.content}
                        secondary={new Date(m.ts).toLocaleString()}
                      />
                    </Paper>
                  </Box>
                </ListItem>
              ))}

              {loading && (
                <ListItem sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <BotIcon />
                    </Avatar>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <CircularProgress size={8} />
                        <CircularProgress size={8} sx={{ animationDelay: '0.2s' }} />
                        <CircularProgress size={8} sx={{ animationDelay: '0.4s' }} />
                      </Box>
                    </Paper>
                  </Box>
                </ListItem>
              )}
            </List>
          </Box>

          <Divider />

          {/* Input Area */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: 'white',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your query... (Press Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              {input && (
                <IconButton
                  onClick={clearInput}
                  disabled={loading}
                  sx={{
                    color: '#64748b',
                    '&:hover': { bgcolor: '#f1f5f9' },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              )}

              <Button
                variant="contained"
                endIcon={loading ? <CircularProgress color="inherit" size={18} /> : <SendIcon />}
                disabled={loading || !input.trim()}
                onClick={sendMessage}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  minWidth: 120,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#94a3b8',
                  },
                }}
              >
                Send
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 1 }}>
              Press Enter to send • Shift+Enter for new line • Esc to clear
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          onClose={() => setError('')}
          variant="filled"
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

function AppShell() {
  const { usercode, role, loggedIn, login, logout } = useSession()

  return (
    <Routes>
      <Route path="/login" element={loggedIn ? <Navigate to="/chat" replace /> : <LoginPage onLogin={login} />} />
      <Route
        path="/chat"
        element={loggedIn ? <ChatPage usercode={usercode} role={role} logout={logout}/> : <Navigate to="/login" replace />}
      />
      <Route path="/" element={<Navigate to={loggedIn ? '/chat' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppShell />
}