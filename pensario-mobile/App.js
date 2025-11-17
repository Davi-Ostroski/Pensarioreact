import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pessoal',
    consultationDate: '',
  });

  // Carregar notas do AsyncStorage
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  // Salvar notas no AsyncStorage
  const saveNotes = async (notesArray) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notesArray));
      setNotes(notesArray);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      Alert.alert('Erro', 'Não foi possível salvar as notas');
    }
  };

  // Função para ordenar notas
  const sortNotes = (notesArray) => {
    return [...notesArray].sort((a, b) => {
      if (
        (a.category === 'Medico' || a.category === 'Outros') &&
        (b.category === 'Medico' || b.category === 'Outros')
      ) {
        const dateA = a.consultationDate
          ? new Date(a.consultationDate)
          : new Date(a.createdAt);
        const dateB = b.consultationDate
          ? new Date(b.consultationDate)
          : new Date(b.createdAt);
        return dateA - dateB;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Abrir modal para nova nota
  const openNewNoteModal = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: 'Pessoal',
      consultationDate: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar nota
  const editNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      consultationDate: note.consultationDate || '',
    });
    setIsModalOpen(true);
  };

  // Excluir nota
  const deleteNote = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta anotação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter((note) => note.id !== id);
            saveNotes(updatedNotes);
          },
        },
      ]
    );
  };

  // Visualizar nota
  const viewNote = (note) => {
    let alertMessage = `Título: ${note.title}\n\nCategoria: ${note.category}\n\nConteúdo:\n${note.content}`;
    if (
      (note.category === 'Medico' || note.category === 'Outros') &&
      note.consultationDate
    ) {
      const consultationDate = new Date(note.consultationDate);
      const formattedConsultationDate = consultationDate.toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );
      alertMessage += `\n\nData: ${formattedConsultationDate}`;
    }
    Alert.alert('Detalhes da Anotação', alertMessage);
  };

  // Submeter formulário
  const handleSubmit = () => {
    const { title, content, category, consultationDate } = formData;

    if (!title.trim() || !content.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    if (
      (category === 'Medico' || category === 'Outros') &&
      !consultationDate
    ) {
      Alert.alert(
        'Atenção',
        'Por favor, preencha a data para a categoria Médico ou Outros.'
      );
      return;
    }

    if (editingNote) {
      // Atualizar nota existente
      const updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? { ...note, title, content, category, consultationDate }
          : note
      );
      saveNotes(updatedNotes);
    } else {
      // Criar nova nota
      const id = Date.now().toString();
      const newNote = {
        id,
        title,
        content,
        category,
        createdAt: new Date().toISOString(),
        consultationDate,
      };
      saveNotes([...notes, newNote]);
    }

    setIsModalOpen(false);
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sortedNotes = sortNotes(notes);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
      
      {/* App Bar */}
      <View style={styles.header}>
        <MaterialIcons name="note" size={24} color="white" />
        <Text style={styles.headerTitle}>Pensário</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <Text style={styles.pageTitle}>Minhas Anotações</Text>

        {sortedNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="note-add" size={80} color="#d1d5db" />
            <Text style={styles.emptyStateText}>
              Nenhuma anotação encontrada
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Clique no botão "+" para criar uma nova anotação
            </Text>
          </View>
        ) : (
          sortedNotes.map((note) => {
            const formattedDate = formatDate(note.createdAt);
            const hasConsultationDate =
              (note.category === 'Medico' || note.category === 'Outros') &&
              note.consultationDate;

            return (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                onPress={() => viewNote(note)}
              >
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity
                      onPress={() => editNote(note)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteNote(note.id)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{note.category}</Text>
                </View>
                {hasConsultationDate && (
                  <Text style={styles.consultationDate}>
                    Data: {formatDate(note.consultationDate)}
                  </Text>
                )}
                <Text style={styles.createdDate}>Criada: {formattedDate}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Add Note Button */}
      <TouchableOpacity style={styles.fab} onPress={openNewNoteModal}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Note Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
            </Text>

            <ScrollView>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
                placeholder="Digite o título"
              />

              <Text style={styles.label}>Conteúdo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.content}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, content: text }))
                }
                placeholder="Digite o conteúdo"
                multiline
                numberOfLines={6}
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryButtons}>
                {['Pessoal', 'Trabalho', 'Estudos', 'Lembretes', 'Medico', 'Outros'].map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        formData.category === cat && styles.categoryButtonActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, category: cat }))
                      }
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          formData.category === cat &&
                            styles.categoryButtonTextActive,
                        ]}
                      >
                        {cat === 'Medico' ? 'Médico' : cat}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {(formData.category === 'Medico' ||
                formData.category === 'Outros') && (
                <>
                  <Text style={styles.label}>Data da Consulta</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.consultationDate}
                    onChangeText={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        consultationDate: text,
                      }))
                    }
                    placeholder="DD/MM/AAAA HH:MM"
                  />
                </>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSave]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonSaveText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    height: 56,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    marginLeft: 16,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: '#111827',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#115e59',
  },
  consultationDate: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '700',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7c3aed',
    backgroundColor: 'white',
  },
  categoryButtonActive: {
    backgroundColor: '#7c3aed',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#7c3aed',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonCancel: {
    borderWidth: 1,
    borderColor: '#7c3aed',
    backgroundColor: 'white',
  },
  buttonCancelText: {
    color: '#7c3aed',
    fontWeight: '500',
  },
  buttonSave: {
    backgroundColor: '#7c3aed',
  },
  buttonSaveText: {
    color: 'white',
    fontWeight: '500',
  },
});
