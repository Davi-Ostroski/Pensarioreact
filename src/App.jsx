import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pessoal',
    consultationDate: ''
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState(null)

  // Carregar notas do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Salvar notas no localStorage
  const saveNotes = (notesArray) => {
    localStorage.setItem('notes', JSON.stringify(notesArray))
    setNotes(notesArray)
  }

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.lang = 'pt-BR'
      recognitionInstance.interimResults = true
      recognitionInstance.continuous = true

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        if (finalTranscript) {
          setFormData(prev => ({
            ...prev,
            content: prev.content + finalTranscript + ' '
          }))
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Erro no reconhecimento:', event.error)
        setIsRecording(false)
        alert('Erro no reconhecimento de voz: ' + event.error)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      recognitionInstance.onstart = () => {
        setIsRecording(true)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  // Função para ordenar notas
  const sortNotes = (notesArray) => {
    return notesArray.sort((a, b) => {
      if ((a.category === 'Medico' || a.category === 'Outros') && (b.category === 'Medico' || b.category === 'Outros')) {
        const dateA = a.consultationDate ? new Date(a.consultationDate) : new Date(a.createdAt)
        const dateB = b.consultationDate ? new Date(b.consultationDate) : new Date(b.createdAt)
        return dateA - dateB
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  // Abrir modal para nova nota
  const openNewNoteModal = () => {
    setEditingNote(null)
    setFormData({
      title: '',
      content: '',
      category: 'Pessoal',
      consultationDate: ''
    })
    setIsModalOpen(true)
  }

  // Abrir modal para editar nota
  const editNote = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      consultationDate: note.consultationDate ? note.consultationDate.substring(0, 16) : ''
    })
    setIsModalOpen(true)
  }

  // Excluir nota
  const deleteNote = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      const updatedNotes = notes.filter(note => note.id !== id)
      saveNotes(updatedNotes)
    }
  }

  // Visualizar nota
  const viewNote = (note) => {
    let alertMessage = `Título: ${note.title}\n\nCategoria: ${note.category}\n\nConteúdo:\n${note.content}`
    if ((note.category === 'Medico' || note.category === 'Outros') && note.consultationDate) {
      const consultationDate = new Date(note.consultationDate)
      const formattedConsultationDate = consultationDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      alertMessage += `\n\nData: ${formattedConsultationDate}`
    }
    alert(alertMessage)
  }

  // Submeter formulário
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const { title, content, category, consultationDate } = formData
    
    if (!title.trim() || !content.trim()) {
      alert('Por favor, preencha todos os campos')
      return
    }

    if ((category === 'Medico' || category === 'Outros') && !consultationDate) {
      alert('Por favor, preencha a data para a categoria Médico ou Outros.')
      return
    }

    if (editingNote) {
      // Atualizar nota existente
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, title, content, category, consultationDate }
          : note
      )
      saveNotes(updatedNotes)
    } else {
      // Criar nova nota
      const id = Date.now().toString()
      const newNote = {
        id,
        title,
        content,
        category,
        createdAt: new Date().toISOString(),
        consultationDate
      }
      saveNotes([...notes, newNote])
    }

    setIsModalOpen(false)
    if (isRecording && recognition) {
      recognition.stop()
    }
  }

  // Controlar gravação de áudio
  const toggleRecording = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop()
      } else {
        recognition.start()
      }
    }
  }

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false)
    if (isRecording && recognition) {
      recognition.stop()
    }
  }

  const sortedNotes = sortNotes([...notes])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-purple-600 text-white flex items-center px-4 shadow-md z-50">
        <span className="material-icons mr-4">notes</span>
        <h1 className="text-xl font-medium app-title">Pensário</h1>
      </header>

      {/* Main Content */}
      <main className="pt-20 p-4">
        <h2 className="text-2xl font-semibold mb-4">Minhas Anotações</h2>

        {/* Notes Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {sortedNotes.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              <div className="text-6xl text-gray-300 mb-4">
                <span className="material-icons" style={{fontSize: '4rem'}}>note_add</span>
              </div>
              <p className="text-lg">Nenhuma anotação encontrada</p>
              <p>Clique no botão "+" para criar uma nova anotação</p>
            </div>
          ) : (
            sortedNotes.map(note => {
              const date = new Date(note.createdAt)
              const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })

              let consultationDateElement = null
              if ((note.category === 'Medico' || note.category === 'Outros') && note.consultationDate) {
                const consultationDate = new Date(note.consultationDate)
                const formattedConsultationDate = consultationDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                consultationDateElement = (
                  <p className="text-sm text-red-600 font-bold">Data: {formattedConsultationDate}</p>
                )
              }

              return (
                <div key={note.id} className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => viewNote(note)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold break-words">{note.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          editNote(note)
                        }}
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 break-words">{note.content}</p>
                  <span className="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs mb-2">{note.category}</span>
                  {consultationDateElement}
                  <p className="text-xs text-gray-400">Criada: {formattedDate}</p>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* Add Note Button */}
      <button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 flex items-center justify-center"
        onClick={openNewNoteModal}
      >
        <span className="material-icons">add</span>
      </button>

      {/* Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4 text-purple-600">
              {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-32 mb-2"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
                {recognition && (
                  <button
                    type="button"
                    className={`rounded-full w-10 h-10 flex items-center justify-center ${
                      isRecording 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    onClick={toggleRecording}
                  >
                    <span className="material-icons text-sm">mic</span>
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Pessoal">Pessoal</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Lembretes">Lembretes</option>
                  <option value="Medico">Médico</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              {(formData.category === 'Medico' || formData.category === 'Outros') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Data da Consulta</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.consultationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultationDate: e.target.value }))}
                    required
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

