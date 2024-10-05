<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">TodoList</h1>

        <!-- Bouton pour ajouter une nouvelle tâche -->
        <div class="flex justify-center mb-4">
            <button id="show-input-button" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                @click="showModal">Ajouter une Tâche</button>
        </div>

        <!-- Formulaire pour ajouter une nouvelle tâche -->
        <div v-if="isModalVisible">
            <form id="add-task-form" @submit.prevent="addTask">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2" for="title">Titre :</label>
                    <input v-model="taskTitle" class="w-full border border-gray-300 p-2 rounded-md" type="text"
                        id="title" name="title" required>

                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2" for="description">Description :</label>
                    <textarea v-model="taskDescription" class="w-full border border-gray-300 p-2 rounded-md"
                        id="description" name="description" required></textarea>
                </div>
                <div class="flex justify-center gap-4">
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ">Ajouter</button>
                    <button id="close-modal-button"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" @click="closeModal"
                        type="button">Annuler</button>

                </div>
            </form>
        </div>

        <!-- Tableau des tâches -->
        <h2 class="text-2xl font-bold text-center mt-10">Liste des tâches</h2>
        <table class="min-w-full border border-gray-300 mt-2 ">
            <thead class="bg-gray-200">
                <tr>
                    <th class="border border-gray-300 p-2 text-left">ID</th>
                    <th class="border border-gray-300 p-2 text-left">Titre</th>
                    <th class="border border-gray-300 p-2 text-left">Description</th>
                    <th class="border border-gray-300 p-2 text-left">Statut</th>
                    <th class="border border-gray-300 p-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody id="task-list" class="bg-white">
                <!-- Les tâches s'afficheront ici -->
                <tr v-for="task in tasks" :key="task.id">
                    <td class="border border-gray-300 p-2">{{ task.id }}</td>
                    <td class="border border-gray-300 p-2">{{ task.title }}</td>
                    <td class="border border-gray-300 p-2">{{ task.description }}</td>
                    <td class="border border-gray-300 p-2">{{ task.status }}</td>
                    <td class="border border-gray-300 p-2">
                        <button class="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                            @click="deleteTask(task.id)">Supprimer</button>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>


</template>

<script setup>
import { ref } from 'vue';
const tasks = ref([]);
// affichage du modal pour ajouter une nouvelle tâche
const isModalVisible = ref(false);
// initialisation des variables pour la recupération des valeurs au niveau du input 
const taskTitle = ref('');
const taskDescription = ref('');

// Fonction pour charger les tâches depuis le localStorage
// onMounted(() => {
//     const storedTasks = localStorage.getItem('tasks');
//     if (storedTasks) {
//         tasks.value = JSON.parse(storedTasks);
//     }
// });

function showModal() {
    isModalVisible.value = true;
}

function closeModal() {
    isModalVisible.value = false;
}

//fonction pour ajouter une tache

function addTask() {
    tasks.value.push({
        id: tasks.value.length + 1,
        title: taskTitle.value,
        description: taskDescription.value,
        status: 'En cours'
    });
    taskTitle.value = ''; // reinitialisation du titre au niveau de la tâche
    taskDescription.value = ''; // reinitialisation de la description au niveau de la tâche
    saveTasks();
    closeModal();
}

// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
}
// fonction de suppression d'une tâche
function deleteTask(taskId) {
  tasks.value = tasks.value.filter((t) => t.id !== taskId);
  saveTasks();
}

</script>


<style scoped></style>