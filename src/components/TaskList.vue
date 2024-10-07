<template>
    <Toast />
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">TodoList</h1>

        <!-- Formulaire pour ajouter ou modifier une tâche -->
        <div class="card flex justify-center">
            <Button label="Ajouter une tâche" severity="primary" @click="visible = true" />

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
                    <Textarea id="task-desc"  class="w-full" v-model="taskDescription" autocomplete="off" required />
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
            <Column field="status" header="Statut" sortable></Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex justify-center mt-2">
                        <Button class="mx-5 " severity="info" label="Modifier" @click="editTask(data)" />
                        <Button severity="danger" label="Supprimer" @click="deleteTask(data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

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
// import Dropdown from 'primevue/dropdown';
const tasks = ref([]);

// affichage du modal pour ajouter une nouvelle tâche

// initialisation des variables pour la recupération des valeurs au niveau du input
const taskTitle = ref('');
const taskDescription = ref('');
const toast = useToast();
const visible = ref(false);
const isEditing = ref(false)
const taskToEdit = ref(null)

// Fonction pour charger les tâches depuis le localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks.value = JSON.parse(storedTasks);
    }
}



//fonction pour ajouter une tache


function addTask() {
    // Utilisation de trim pour vérifier si les champs sont vides
    if (taskTitle.value.trim() === '' || taskDescription.value.trim() === '') {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs.', life: 3000 });
        return;
    }
    tasks.value.push({
        id: tasks.value.length + 1,
        title: taskTitle.value,
        description: taskDescription.value,
        status: 'En cours'
    });
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
    tasks.value[index].status = 'En cours';
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
}
// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
}
// fonction de suppression d'une tâche
function deleteTask(taskId) {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    saveTasks();
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Tâche supprimée avec succès!', life: 3000 });

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