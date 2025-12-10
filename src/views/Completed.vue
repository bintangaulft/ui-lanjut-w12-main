<template>
  <h3>Completed ✅</h3>
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
      <li v-for="completedTodo in filteredCompletedTodos" :key="completedTodo.id" :class="`priority-${completedTodo.priority.toLowerCase()}`">
        <div class="todo-row">
          <div class="todo-main">
            <span class="todo-text">
              <span class="priority-badge" :class="`priority-${completedTodo.priority.toLowerCase()}`">[{{ completedTodo.priority }}]</span>
              <span class="completed-text">{{ completedTodo.text }}</span>
            </span>
            <div class="todo-meta">
              <small class="created">Created: {{ completedTodo.createdAt }}</small>
              <small class="deadline" v-if="completedTodo.deadline">Deadline: {{ completedTodo.deadline }}</small>
              <small class="deadline" v-else>No deadline</small>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { useTodos } from '@/stores/todos'
import { mapState } from 'pinia';

export default {
  computed: {
    ...mapState(useTodos, [
      'completedTodos',
    ]),
    filteredCompletedTodos() {
      let todos = this.selectedPriority === 'All' 
        ? this.completedTodos 
        : this.completedTodos.filter(todo => todo.priority === this.selectedPriority)
      
      
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
  })
}
</script>