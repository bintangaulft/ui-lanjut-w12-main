<template>
  <h3>To-Do ⏳</h3>
    <form @submit.prevent="addTodo">
      <div class="form-row">
        <input v-model="todo.text" type="text" name="text" placeholder="New task" />
        <input v-model="todo.deadline" type="datetime-local" name="deadline" />
        <select v-model="todo.priority" name="priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button :disabled="!todo.text" type="submit">Add</button>
      </div>
    </form>
  <div class="filter-container">
    <button 
      class="filter-btn" 
      :class="{ active: selectedPriority === 'All' }" 
      @click="selectedPriority = 'All'"
    >All</button>
    <button 
      class="filter-btn priority-low" 
      :class="{ active: selectedPriority === 'Low' }" 
      @click="selectedPriority = 'Low'"
    >Low</button>
    <button 
      class="filter-btn priority-medium" 
      :class="{ active: selectedPriority === 'Medium' }" 
      @click="selectedPriority = 'Medium'"
    >Medium</button>
    <button 
      class="filter-btn priority-high" 
      :class="{ active: selectedPriority === 'High' }" 
      @click="selectedPriority = 'High'"
    >High</button>
  </div>
  <div>
    <ul>
      <li v-for="pendingTodo in filteredTodos" :key="pendingTodo.id" :class="[`priority-${pendingTodo.priority.toLowerCase()}`, { overdue: isOverdue(pendingTodo) }]">
        <template v-if="!pendingTodo.isEditing">
          <div class="todo-row">
            <div class="todo-main">
              <span class="todo-text">
                <span v-if="isOverdue(pendingTodo)" class="overdue-icon">⚠️</span>
                <span class="priority-badge" :class="`priority-${pendingTodo.priority.toLowerCase()}`">[{{ pendingTodo.priority }}]</span>
                {{ pendingTodo.text }}
              </span>
              <div class="todo-meta">
                <small class="created">Created: {{ pendingTodo.createdAt }}</small>
                <small class="deadline" v-if="pendingTodo.deadline">Deadline: {{ pendingTodo.deadline }}</small>
                <small class="deadline" v-else>No deadline</small>
              </div>
            </div>
            <div class="todo-actions">
              <button class="emoji-btn edit-btn" title="Edit task" aria-label="Edit task" @click="startEdit(pendingTodo.id)">✏️</button>
              <button class="emoji-btn done-btn" title="Mark as done" aria-label="Mark as done" @click="updateTodo({ ...pendingTodo, isCompleted: true})">✅</button>
              <button class="emoji-btn remove-btn" title="Remove task" aria-label="Remove task" @click="destroyTodo(pendingTodo.id)">🗑️</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="edit-row">
            <div class="edit-left">
              <input class="edit-text" v-model="pendingTodo.tempText" type="text" />
              <input class="edit-deadline" v-model="pendingTodo.tempDeadline" type="datetime-local" />
            </div>
            <div class="edit-right">
              <button class="emoji-btn save-btn" title="Save" aria-label="Save" @click="saveEdit(pendingTodo.id)" :disabled="!pendingTodo.tempText">💾</button>
              <button class="emoji-btn cancel-btn" title="Cancel" aria-label="Cancel" @click="cancelEdit(pendingTodo.id)">❌</button>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { useTodos } from '@/stores/todos'
import { mapActions, mapState } from 'pinia';
export default {
  computed: {
    ...mapState(useTodos, [
      'pendingTodos',
    ]),
    filteredTodos() {
      let todos = this.selectedPriority === 'All' 
        ? this.pendingTodos 
        : this.pendingTodos.filter(todo => todo.priority === this.selectedPriority)
      
      
      return todos.slice().sort((a, b) => {
        if (a.deadline && b.deadline) {
          return new Date(a.deadline.replace(' ', 'T')) - new Date(b.deadline.replace(' ', 'T'))
        }
        if (a.deadline && !b.deadline) return -1
        if (!a.deadline && b.deadline) return 1
        return 0
      })
    }
  },
  data: () => ({
    selectedPriority: 'All',
    todo: {
      text: null,
      isCompleted: false,
      deadline: '',
      priority: 'Low',
    }
  }),
  methods: {
    ...mapActions(useTodos, [
      'storeTodo',
      'updateTodo',
      'destroyTodo',
      'startEdit',
      'saveEdit',
      'cancelEdit',
    ]),
    addTodo() {
      this.storeTodo(this.todo)
      this.todo.text = null
      this.todo.deadline = ''
      this.todo.priority = 'Low'
    },
    isOverdue(todo) {
      if (!todo.deadline) return false
      if (todo.isCompleted) return false
      const dl = new Date(todo.deadline.replace(' ', 'T'))
      return !isNaN(dl) && new Date() > dl
    },
  }
}
</script>
