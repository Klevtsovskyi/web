<template>
  <div class="modal" v-if="modal_opened" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create Task</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" v-on:click="openCloseModal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col d-flex justify-content-center">
            <input v-model="new_task" type="text" placeholder="Enter Task description">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="openCloseModal">Close
          </button>
          <button type="button" class="btn btn-primary" v-on:click="createTask">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row" style="padding-top: 5rem">
      <div class="col d-flex justify-content-center align-items-center" style="gap: 15px">
        <button class="btn btn-primary" v-on:click="openCloseModal">Create Task</button>
        <button class="btn btn-secondary" v-on:click="clearCompletedTasks">Clear Completed</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input type="text" v-model="search_input" v-on:input="search">
      </div>
      <div class="col">
          <button v-on:click="sortByDate">SortByDate</button>
      </div>
    </div>
    <div class="row">
      <div v-if="found_tasks.length===0 && search_input.length!==0" class="task-warning">
        <h1>Нічого не знайдено</h1>
      </div>
      <div v-if="found_tasks.length!==0" class="col">
        <div class="title">
          <h1>Знайдено:</h1>
        </div>
        <div class="task-container">
          <div class="search-task-wrap">

            <div class="" v-for="task in found_tasks">
              <div class="uncompleted task" v-if="!task.completed">

                <h1> {{ task.text }}</h1>
                <div class="d-flex date-checkbox-wrap">
                  <h1>{{ dateFormat(task.date) }}</h1>
                  <input type="checkbox" v-if="task.completed" v-on:change="completeTask(task)" checked>
                  <input type="checkbox" v-if="!task.completed" v-on:change="completeTask(task)">
                  <button v-on:click="deleteTask" class="btn btn-danger" style="margin-left: 1rem">Delete</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="tasks.length===0" class="task-warning"><h1>Завдань на сьогодні немає</h1></div>
      <div v-if="tasks.length!==0" class="col">
        <div class="title">
          <h1>Завдання на сьогодні</h1>
        </div>
        <div class="task-container">
          <div class="task-wrap">

            <div class="" v-for="task in tasks">
              <div class="uncompleted task" v-if="!task.completed">

                <h1> {{ task.text }}</h1>
                <div class="d-flex date-checkbox-wrap">
                  <h1>{{ dateFormat(task.date) }}</h1>
                  <input type="checkbox" v-if="task.completed" v-on:change="completeTask(task)" checked>
                  <input type="checkbox" v-if="!task.completed" v-on:change="completeTask(task)">
                  <button v-on:click="deleteTask" class="btn btn-danger" style="margin-left: 1rem">Delete</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </div>
    <div class="row">
      <div v-if="tasks.length!==0" class="col">
        <div class="title">
          <h1> Виконані завдання </h1>
        </div>
        <div class="task-container">
          <div class="task-wrap">
            <div class="" v-for="task in tasks">
              <div v-if="task.completed" class="d-flex task">
                <h1> {{ task.text }}</h1>
                <div class="d-flex date-checkbox-wrap">
                  <h1>{{ dateFormat(task.date) }}</h1>
                  <input type="checkbox" v-if="task.completed" v-on:change="completeTask(task)" checked>
                  <input type="checkbox" v-if="!task.completed" v-on:change="completeTask(task)">
                  <button v-on:click="deleteTask" class="btn btn-danger" style="margin-left: 1rem">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h1>{{getCompletedVSUncompleted()}}</h1>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref} from "vue";

const new_task = ref("")
const tasks = ref([])
const modal_opened = ref(false);
const found_tasks = ref([])
const search_input = ref("")
function createTask() {

  if (new_task.value.length !== 0) {
    let data = {
      date: Date.now(),
      text: new_task.value,
      completed: false
    }
    tasks.value.push(
        data
    )
    console.log(data)
    new_task.value = ""
  }
  openCloseModal()
}

function completeTask(event) {
  event.completed = !event.completed
  console.log()


}
function getCompletedVSUncompleted(){
  let completed = 0
  let uncompleted = 0
  for (let i = 0; i < tasks.value.length; i++) {
    if (tasks.value[i].completed) {
      completed+=1;
    }else{
      uncompleted+=1;
    }
  }
  return "Completed: "+completed+" | Uncompleted: "+uncompleted
}
function sortByDate(){
  tasks.value.sort((a,b) => b.date - a.date)
}

function clearCompletedTasks() {
  let uncompleted = []
  for (let i = 0; i < tasks.value.length; i++) {
    if (!tasks.value[i].completed) {
      uncompleted.push(tasks.value[i])
    }
  }
  tasks.value = uncompleted
}

function openCloseModal() {
  modal_opened.value = !modal_opened.value;
}

function deleteTask(task) {
  tasks.value.splice(tasks.value.indexOf(task), 1)
}

function dateFormat(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString("uk-UA")

}

function search() {
  let found_tasks1 = []
  for (let i = 0; i < tasks.value.length; i++) {
    let text_val = tasks.value[i].text.toLowerCase()
    console.log(search_input.value)
    let input_val = search_input.value.toLowerCase()
    if (text_val.includes(input_val)) {




      found_tasks1.push(tasks.value[i])
    }
  }
  found_tasks.value = found_tasks1
}

</script>

<style scoped>

.task-container, .task-warning {
  padding: 2rem 0;
  text-align: center;
  width: 100%;

}

.task-wrap {
  border: 1px black dashed;
  border-radius: 10px;
  padding: 2rem;
}
.search-task-wrap{
  border: 1px #115ac8 dashed;
  border-radius: 10px;
  padding: 2rem;
}
.task {
  margin-top: 1rem;
  padding: 0.25rem;
  box-shadow: 0 0 4px black;
  display: flex;
  border-radius: 10px;
  align-content: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.title {
  text-align: center;
}

.modal {
  display: block !important;
  background: rgba(0, 0, 0, 0.4);
}

.date-checkbox-wrap input {
  margin-left: 1rem;
}
</style>