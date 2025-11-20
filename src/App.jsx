import { useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Clear as ClearIcon,
  Mic as MicIcon,
  Mic,
} from '@mui/icons-material';
import './App.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const USER_API_BASE_URL =
  import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5005';

let historyFetchedThisPage = false;

function useSession() {
  const [usercode, setUsercode] = useState(
    () => localStorage.getItem('usercode') || ''
  );
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');

  const loggedIn = !!role && (role === 'user' || !!usercode);

  const login = (uc, r) => {
    localStorage.setItem('usercode', uc);
    localStorage.setItem('role', r);
    setUsercode(uc);
    setRole(r);
    historyFetchedThisPage = false;
    sessionStorage.removeItem(`historyFetched:${uc}`);
  };

  const logout = () => {
    const uc = localStorage.getItem('usercode');
    localStorage.removeItem('usercode');
    localStorage.removeItem('role');
    if (uc) sessionStorage.removeItem(`historyFetched:${uc}`);
    setUsercode('');
    setRole('');
    historyFetchedThisPage = false;
  };

  return { usercode, role, loggedIn, login, logout };
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState('');
  const [usercode, setUsercode] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!role) newErrors.role = 'Please select a role';
    if (role !== 'user' && !usercode.trim())
      newErrors.usercode = 'Please enter user id';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    onLogin(role === 'user' ? '' : usercode.trim(), role);
    navigate('/chat', { replace: true });
  };

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
      <Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1 }}>
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
              variant='h4'
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
            <Typography variant='body1' color='text.secondary'>
              Sign in to continue to your workspace
            </Typography>
          </Box>

          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label='Select Role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              margin='normal'
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
              <MenuItem value='depot'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}
                    >
                      D
                    </Typography>
                  </Box>
                  Depot
                </Box>
              </MenuItem>
              <MenuItem value='distillery'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background:
                        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}
                    >
                      D
                    </Typography>
                  </Box>
                  Distillery
                </Box>
              </MenuItem>
              <MenuItem value='user'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{ color: 'white', fontSize: 14, fontWeight: 700 }}
                    >
                      U
                    </Typography>
                  </Box>
                  User
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              label='User ID'
              placeholder='Enter your user code'
              value={usercode}
              onChange={(e) => setUsercode(e.target.value)}
              margin='normal'
              disabled={role === 'user'}
              error={!!errors.usercode && role !== 'user'}
              helperText={
                role === 'user' ? 'Not required for User' : errors.usercode
              }
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
              variant='contained'
              type='submit'
              size='large'
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
                  background:
                    'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              Continue to Chat
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Chip label='Secure Login' size='small' />
          </Divider>

          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'block', textAlign: 'center' }}
          >
            Your session is encrypted and secure
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

function ChatTopBar({ usercode, role, onLogout, messageCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const ok = window.confirm('Log out from this session?');
    if (!ok) return;
    onLogout();
    navigate('/login', { replace: true });
  };

  const getRoleConfig = () => {
    if (role === 'depot') {
      return { color: '#10b981', bg: '#d1fae5', label: 'Depot' };
    }
    if (role === 'user') {
      return { color: '#3b82f6', bg: '#dbeafe', label: 'User' };
    }
    return { color: '#f59e0b', bg: '#fef3c7', label: 'Distillery' };
  };

  const roleConfig = getRoleConfig();

  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}
        >
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
            <Typography variant='h6' sx={{ fontWeight: 700, color: 'white' }}>
              AI Assistant
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {usercode && (
                <Chip
                  icon={
                    <PersonIcon
                      sx={{ fontSize: 14, color: roleConfig.color }}
                    />
                  }
                  label={usercode}
                  size='small'
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
                size='small'
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
  );
}

function toMessageItems(rows) {
  const items = [];

  rows.forEach((r, i) => {
    // User message (may include audio + transcription)
    if (r.message) {
      items.push({
        id: `u-${r.created_at}-${i}`,
        role: 'user',
        content: r.message,
        audio: r.audio || null, // expect base64 string or null
        ts: r.created_at,
      });
    }

    // Assistant response (text only)
    if (r.response) {
      items.push({
        id: `a-${r.created_at}-${i}`,
        role: 'assistant',
        content: r.response,
        audio: null,
        ts: r.created_at,
        isaudiores:r.audio?true:false
      });
    }
  });

  return items;
}

function ChatPage({ usercode, role, logout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const listRef = useRef(null);

  const api5000 = useMemo(
    () => axios.create({ baseURL: API_BASE_URL, timeout: 30000 }),
    []
  );
  const api5005 = useMemo(
    () => axios.create({ baseURL: USER_API_BASE_URL, timeout: 30000 }),
    []
  );

  // ----------------------------------------------------------
  // START RECORDING
  // ----------------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {};

      recorder.start();
      setRecording(true);
    } catch (err) {
      setError('Microphone access denied');
    }
  };

  // ----------------------------------------------------------
  // STOP AND SEND
  // ----------------------------------------------------------
  const stopAndSend = () => {
    if (!mediaRecorderRef.current || !recording) return;

    const recorder = mediaRecorderRef.current;

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      chunksRef.current = [];
      setRecording(false);

      const now = Date.now();

      // 👉 1. Immediately show audio bubble (before sending)
      setMessages((m) => [
        ...m,
        {
          id: `${now}-u-audio`,
          role: 'user',
          audio: URL.createObjectURL(blob), // local preview
          content: '', // no text yet
          ts: new Date().toISOString(),
        },
      ]);

      // 👉 2. Send to backend
      await sendVoiceMessage(blob, now);
    };

    recorder.stop();
  };

  // ----------------------------------------------------------
  // CANCEL RECORDING
  // ----------------------------------------------------------
  const cancelRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.onstop = () => {};
      mediaRecorderRef.current.stop();
    }
    chunksRef.current = [];
    setRecording(false);
  };

  // ----------------------------------------------------------
  // SEND AUDIO MESSAGE
  // ----------------------------------------------------------
  const sendVoiceMessage = async (blob, msgId) => {
    if (!blob) return;

    const formData = new FormData();
    formData.append('audio', blob, 'voice.webm');
    formData.append('usercode', usercode);
    formData.append('role', role);

    try {
      setLoading(true);

      const res = await api5000.post('/voice', formData);

      const text = res.data.voice_text || '';
      const reply = res.data.response || '';

      // 👉 3. Update the existing audio bubble to include the transcription
      setMessages((m) =>
        m.map((msg) =>
          msg.id === `${msgId}-u-audio`
            ? { ...msg, content: text } // add transcription under audio
            : msg
        )
      );

      // 👉 4. Append assistant reply
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-a`,
          role: 'assistant',
          content: reply,
          ts: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError('Voice query failed');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // HISTORY LOADING
  // ----------------------------------------------------------
  useEffect(() => {
    if (role === 'user') return;
    if (historyFetchedThisPage) return;
    historyFetchedThisPage = true;

    const fetchHistory = async () => {
      try {
        const res = await api5000.get(
          `/analyze/history/${encodeURIComponent(usercode)}`
        );
        const rows = res.data?.history || [];

        if (rows.length === 0) {
          setMessages([
            {
              id: 'empty',
              role: 'system',
              content: 'No previous conversations. Start a new conversation!',
              ts: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages(toMessageItems(rows));
        }
      } catch {
        setError('Failed to load history');
      }
    };

    fetchHistory();
  }, [role, usercode]);

  // ----------------------------------------------------------
  // AUTO-SCROLL
  // ----------------------------------------------------------
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  // ----------------------------------------------------------
  // SEND TEXT MESSAGE
  // ----------------------------------------------------------
  const sendMessage = async () => {
    const q = input.trim();
    if (!q || loading) return;

    const userMsg = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: q,
      ts: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let res;

      if (role === 'user') {
        res = await api5005.post('/userquery', { query: q });
      } else {
        res = await api5000.post('/analyze', { query: q, usercode, role });
      }

      const answer =
        res?.data?.response ??
        res?.data?.answer ??
        res?.data?.result ??
        res?.data?.message ??
        (typeof res?.data === 'string' ? res.data : 'No response');

      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-a`,
          role: 'assistant',
          content: answer,
          ts: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearInput = () => setInput('');

  const playTTS = async (text) => {
  try {
    const res = await api5000.post("/tts", { text });  // JSON

    const base64 = res.data.audio;
    const audioUrl = base64;

    const audio = new Audio(audioUrl);
    audio.play();

  } catch (err) {
    console.error("Error playing TTS", err);
  }
};



  console.log('Messages:', messages);

  // ----------------------------------------------------------
  // UI START
  // ----------------------------------------------------------
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        bgcolor: '#f8fafc',
      }}
    >
      <ChatTopBar
        usercode={usercode}
        role={role}
        onLogout={logout}
        messageCount={messages.length}
      />

      <Container
        maxWidth='lg'
        sx={{
          flex: 1,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 105px)',
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
          {/* MESSAGES AREA */}
          <Box
            ref={listRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              background:
                'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <List sx={{ width: '100%' }}>
              {messages.map((m) => (
                <ListItem
                  key={m.id}
                  alignItems='flex-start'
                  sx={{ px: 0, mb: 2 }}
                >
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
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <BotIcon />
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{
                          background:
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
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
                      }}
                    >
                      <Box>
                        {m.audio ? (
                          <>
                            {/* try webm first; if your backend uses a different format adjust mime type */}
                            <audio
                              controls
                              src={
                                m.audio?.startsWith('blob:')
                                  ? m.audio
                                  : m.audio // history from DB
                              }
                              style={{ width: '100%', marginBottom: 8 }}
                            />
                            {/* show transcription under the player (if present) */}
                          </>
                        ) : (
                          <Typography
                            sx={{
                              whiteSpace: 'pre-wrap',
                              fontSize: 15,
                              lineHeight: 1.6,
                            }}
                          >
                            {m.content}
                          </Typography>
                        )}

                        <Typography
                          sx={{ fontSize: 12, color: '#64748b', mt: 1 }}
                        >
                          {new Date(m.ts).toLocaleString()}
                        </Typography>
                          {m.isaudiores && (
  <Box
    onClick={() => playTTS(m.content)}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.8,
      px: 1.2,
      py: 0.4,
      borderRadius: "16px",
      bgcolor: "#e2e8f0",
      cursor: "pointer",
      transition: "all 0.2s",
      "&:hover": { bgcolor: "#cbd5e1" }
    }}
  >
    <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#475569" }}>
      Play Audio
    </Typography>
  </Box>
)}
                      </Box>
                    </Paper>
                  </Box>
                </ListItem>
              ))}

              {loading && (
                <ListItem sx={{ px: 0 }}>
                  <CircularProgress size={24} />
                </ListItem>
              )}
            </List>
          </Box>

          <Divider />

          {/* INPUT AREA */}
          <Box
            sx={{ p: 2.5, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              {/* VOICE BUTTONS */}
              {role !== 'user' && (
                <>
                  {!recording && (
                    <IconButton
                      onClick={startRecording}
                      sx={{
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        '&:hover': { background: '#c7d2fe' },
                      }}
                    >
                     <Mic />
                    </IconButton>
                  )}

                  {recording && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#dc2626',
                          animation: 'pulse 1s infinite',
                        }}
                      />
                      <Typography sx={{ fontWeight: 600, color: '#dc2626' }}>
                        Recording...
                      </Typography>

                      <IconButton
                        onClick={cancelRecording}
                        sx={{ color: '#dc2626' }}
                      >
                        ✖
                      </IconButton>
                      <IconButton
                        onClick={stopAndSend}
                        sx={{ color: '#059669' }}
                      >
                        ✓
                      </IconButton>
                    </Box>
                  )}
                </>
              )}

              {/* TEXT INPUT */}
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder='Type your query...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    '&.Mui-focused fieldset': { borderColor: '#667eea' },
                  },
                }}
              />

              {input && (
                <IconButton
                  onClick={clearInput}
                  disabled={loading}
                  sx={{ color: '#64748b' }}
                >
                  <ClearIcon />
                </IconButton>
              )}

              {/* SEND TEXT BUTTON */}
              <Button
                variant='contained'
                endIcon={
                  loading ? (
                    <CircularProgress color='inherit' size={18} />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={loading || !input.trim()}
                onClick={sendMessage}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* ERROR POPUP */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity='error' variant='filled' onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function AppShell() {
  const { usercode, role, loggedIn, login, logout } = useSession();

  return (
    <Routes>
      <Route
        path='/login'
        element={
          loggedIn ? (
            <Navigate to='/chat' replace />
          ) : (
            <LoginPage onLogin={login} />
          )
        }
      />
      <Route
        path='/chat'
        element={
          loggedIn ? (
            <ChatPage usercode={usercode} role={role} logout={logout} />
          ) : (
            <Navigate to='/login' replace />
          )
        }
      />
      <Route
        path='/'
        element={<Navigate to={loggedIn ? '/chat' : '/login'} replace />}
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppShell />;
}
