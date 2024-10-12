<template>
    <Toast />

    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">TodoList</h1>

        <!-- Formulaire pour ajouter ou modifier une tâche -->
        <div class="card flex justify-center">
            <Button icon=" pi pi-plus" label="Ajouter une tâche" severity="primary" @click="openModalTask" />


            <Dialog v-model:visible="visible" modal :header="isEditing ? 'Modifier une tâche' : 'Ajouter une tâche'"
                :style="{ width: '90%', maxWidth: '25rem' }">
                <span class="text-surface-500 block mb-8">Veuillez {{ isEditing ? 'modifier' : 'ajouter' }} les détails
                    de la tâche.</span>

                <div class="flex flex-col gap-4 mb-4">
                    <label for="task-title" class="font-semibold">Titre</label>
                    <InputText id="task-title" class="w-full" v-model="taskTitle" autocomplete="off" required />
                </div>

                <div class="flex flex-col gap-4 mb-8">
                    <label for="task-desc" class="font-semibold">Description</label>
                    <Textarea id="task-desc" class="w-full" v-model="taskDescription" autocomplete="off" required />
                </div>
                <div class="flex flex-col gap-4 mb-4">
                    <label for="task-status" class="font-semibold">Statut</label>
                    <select id="task-status" v-model="taskStatus" class="w-full">
                        <option :value="false">En cours</option>
                        <option :value="true">Terminé</option>
                    </select>
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Annuler" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" :label="isEditing ? 'Modifier' : 'Ajouter'"
                        @click="isEditing ? updateTask() : addTask()" severity="success"></Button>
                </div>
            </Dialog>
        </div>




        <h2 class="text-2xl font-bold text-center mt-10">Liste des tâches</h2>
        <DataTable :value="tasks" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" class="mt-2">
            <Column field="id" header="ID" sortable></Column>
            <Column field="title" header="Titre" sortable></Column>
            <Column field="description" header="Description" sortable></Column>
            <Column field="status" header="Statut" sortable>
                <template #body="slotProps">
                    {{ getStatusText(slotProps.data.status) }}
                </template>
            </Column>
            <Column header="Actions" class="flex justify-center">
                <template #body="{ data }">
                    <div class="flex justify-center mt-2">
                        <Button icon="pi pi-pencil" severity="info" @click="editTask(data)" rounded />
                        <Button icon="pi pi-eye" class="mx-4" severity="help" @click="viewDetailTask(data)" rounded />
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDelete(data)" rounded />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>


    <!-- Dialog pour afficher les détails de la tâche -->
    <Dialog v-model:visible="detailsVisible" modal :header="'Détails de la tâche'" :style="{ width: '350px' }">
        <div class="flex flex-col space-y-4">
            <h3 class="font-semibold text-lg text-gray-800">Titre:</h3>
            <p class="text-gray-600">{{ taskDetails.title }}</p>

            <h3 class="font-semibold text-lg text-gray-800">Description:</h3>
            <p class="text-gray-600">{{ taskDetails.description }}</p>

            <h3 class="font-semibold text-lg text-gray-800">Statut:</h3>
            <p class="text-gray-600">{{ taskDetails.status == false ? 'En cours' : 'Terminé' }}</p>
        </div>

        <div class="flex justify-end mt-6">
            <Button type="button" label="Fermer" severity="secondary" @click="detailsVisible = false"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150" />
        </div>
    </Dialog>


    <!-- Dialogue de confirmation de suppression -->
    <Dialog v-model:visible="confirmDeleteVisible" modal header="Confirmation de suppression"
        :style="{ width: '350px' }">
        <span>Voulez-vous vraiment supprimer cette tâche ?</span>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Annuler" severity="secondary" @click="confirmDeleteVisible = false" />
            <Button type="button" label="Confirmer" severity="danger" @click="deleteTask(taskToDelete)" />
        </div>
    </Dialog>

</template>


<script setup>
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css'


const tasks = ref([]);
const taskTitle = ref('');
const taskDescription = ref('');
const toast = useToast();
const visible = ref(false);
const isEditing = ref(false);
const taskToEdit = ref(null);
const confirmDeleteVisible = ref(false);
const taskToDelete = ref(null);
const detailsVisible = ref(false);
const taskDetails = ref({});
const taskStatus = ref(false);




// Méthode pour convertir le statut
function getStatusText(status) {
    return status ? 'Terminé' : 'En cours';
}


// fonction pour ouvrir le modal d'ajout
function openModalTask() {
    resetForm();
    visible.value = true;
    isEditing.value = false;
}

// Fonction pour charger les tâches depuis le localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    const storedId = localStorage.getItem('currentId'); // Récupérer l'ID stocké

    if (storedTasks) {
        tasks.value = JSON.parse(storedTasks);
    } else if (storedId) {
        id = parseInt(storedId); // Charger l'ID actuel depuis le localStorage
    }
}

let id = 1

//fonction pour ajouter une tache

localStorage.setItem('currentId', id); // Mettre à jour l'ID dans le localStorage

function addTask() {
    // Utilisation de trim pour vérifier si les champs sont vides
    if (taskTitle.value.trim() === '' || taskDescription.value.trim() === '') {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs.', life: 3000 });
        return;
    }
    tasks.value.push({
        id: id++,
        title: taskTitle.value,
        description: taskDescription.value,
        status: taskStatus.value
    });

    // Sauvegarder les tâches et le nouvel ID dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    localStorage.setItem('currentId', id); // Mettre à jour l'ID stocké dans le localStorage
    // Inverser la liste pour que les nouvelles tâches apparaissent en premier
    tasks.value.reverse();
    resetForm();
    saveTasks();
    // Afficher le message de succès
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Tâche ajoutée avec succès!', life: 3000 });
}


//Fonction pour modifier une  tache
function editTask(task) {
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    visible.value = true;
    isEditing.value = true;
    // toast.add({ severity: 'success', summary: 'Succès', detail: 'Tâche modifiée avec succès!', life: 3000 });
    taskToEdit.value = task;
    taskStatus.value = task.status;
}


function updateTask() {
    if (taskTitle.value.trim() === '' || taskDescription.value.trim() === '') {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir  tous les champs.', life: 3000 });
        isEditing.value = false;
        return;
    }
    const index = tasks.value.findIndex(t => t.id === taskToEdit.value.id);
    tasks.value[index].title = taskTitle.value;
    tasks.value[index].description = taskDescription.value;
    tasks.value[index].status = taskStatus.value;
    saveTasks();
    isEditing.value = false;
    visible.value = false;
    resetForm();
    toast.add({ severity: 'success', summary: 'Succès', detail: ' Tâche modifiée avec succès!', life: 3000 });
}



// Réinitialiser le formulaire
function resetForm() {
    taskTitle.value = '';
    taskDescription.value = '';
    visible.value = false;
    isEditing.value = false;
    taskToEdit.value = null;
    taskStatus.value = false;
}
// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
}
// fonction de suppression d'une tâche
function deleteTask() {
    tasks.value = tasks.value.filter((t) => t.id !== taskToDelete.value.id);
    saveTasks();
    confirmDeleteVisible.value = false;
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Tâche supprimée avec succès!', life: 3000 });

}

// Fonction pour confirmer la suppression
function confirmDelete(task) {
    taskToDelete.value = task;
    confirmDeleteVisible.value = true;
}

function viewDetailTask(task) {
    taskDetails.value = task;
    detailsVisible.value = true;
}

onMounted(() => {
    loadTasks();
})

</script>


<style scoped>
@media (max-width: 640px) {

    /*  les styles pour les petits écrans */
    .max-w-4xl {
        max-width: 100%;
        padding: 0 1rem;
    }

    .card {
        width: 100%;
    }

    .Dialog {
        width: 90%;
        max-width: 350px;
    }

    .p-inputtext,
    .p-textarea {
        width: 100%;
        /* S'assurer que les champs remplissent toute la largeur */
    }

}
</style>