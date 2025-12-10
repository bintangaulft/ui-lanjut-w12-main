import { defineStore } from "pinia"


function formatDateTime(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const useTodos = defineStore('useTodos', {
  actions: {
    storeTodo(payload) {
      const createdAt = formatDateTime(new Date())
      const deadline = payload.deadline ? formatDateTime(new Date(payload.deadline)) : ''
      const priority = payload.priority || 'Low'
      this.todos.push({ id: this.nextId++, text: payload.text, isCompleted: false, isEditing: false, tempText: '', tempDeadline: '', createdAt, deadline, priority })
    },
    updateTodo(payload) {
      const index = this.todos.findIndex(item => item.id == payload.id)
      if (index != -1) {
        const current = this.todos[index]
        this.todos[index] = {
          ...current,
          text: payload.text !== undefined ? payload.text : current.text,
          isCompleted: payload.isCompleted !== undefined ? payload.isCompleted : current.isCompleted,
          isEditing: payload.isEditing !== undefined ? payload.isEditing : current.isEditing,
          tempText: payload.tempText !== undefined ? payload.tempText : current.tempText,
          priority: payload.priority !== undefined ? payload.priority : current.priority,
        }
      }
    },
    startEdit(id) {
      const index = this.todos.findIndex(item => item.id == id)
      if (index !== -1) {
        this.todos[index].isEditing = true
        this.todos[index].tempText = this.todos[index].text
        this.todos[index].tempDeadline = this.todos[index].deadline ? this.todos[index].deadline.replace(' ', 'T') : ''
      }
    },
    saveEdit(id) {
      const index = this.todos.findIndex(item => item.id == id)
      if (index !== -1) {
        this.todos[index].text = this.todos[index].tempText
        if (this.todos[index].tempDeadline) {
          this.todos[index].deadline = this.todos[index].tempDeadline.replace('T', ' ')
        } else {
          this.todos[index].deadline = ''
        }
        this.todos[index].isEditing = false
        this.todos[index].tempText = ''
        this.todos[index].tempDeadline = ''
      }
    },
    cancelEdit(id) {
      const index = this.todos.findIndex(item => item.id == id)
      if (index !== -1) {
        this.todos[index].tempText = this.todos[index].text
        this.todos[index].tempDeadline = this.todos[index].deadline ? this.todos[index].deadline.replace(' ', 'T') : ''
        this.todos[index].isEditing = false
      }
    },
    destroyTodo(id) {
      const index = this.todos.findIndex(item => item.id == id)
      if (index > -1 && index < this.todos.length) {
        this.todos.splice(index, 1)
      }
    },
  },
  
  state:() => ({
    nextId: 0,
    todos:[],
  }),
    getters: {
    pendingTodos: (state) => {
      return state.todos.filter(todo => !todo.isCompleted)
    },
    completedTodos: (state) => {
      return state.todos.filter(todo => todo.isCompleted)
    }
  }
})