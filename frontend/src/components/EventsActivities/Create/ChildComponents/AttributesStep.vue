<template>
  <div class="flex">
    <div class="small-containers">
      <div>
        <span class="text-h6 text-bold text-primary">{{ $t(`labels.${type}Name`) }}</span>
        <q-input rounded outlined v-model="name" :placeholder="$t('placeholders.insertText')" @blur="() => name = (name?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">{{ $t('labels.description') }}</span>
        <q-input type="textarea" rounded outlined v-model="description" :placeholder="$t('placeholders.insertText')"  @blur="() => description = (description?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">{{ $t('labels.note') }}</span>
        <q-input rounded outlined v-model="note" :placeholder="$t('placeholders.insertText')" @blur="() => note = (note?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>
    </div>

    <div class="small-containers border-primary-left">
      <div>
        <span class="text-h6 text-bold text-primary">{{ $t('labels.maxParticipants') }}</span>
        <q-input class="q-mb-xs" rounded outlined maxlength="6" v-model="maxParticipants" :placeholder="$t('placeholders.insertNumber')" @update:model-value="handleMaxParticipants" :rules="[val => parseFloat(val.replace(/\./g, '').replace(',', '.')) > 0]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">{{ $t('labels.startDate') }}</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="startingDate" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">{{ $t('labels.endDate') }}</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="endingDate" :rules="[val => !!val, val => !startingDate || new Date(val) > new Date(startingDate)]" hide-bottom-space/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';
import { useRoute } from 'vue-router';

const route = useRoute();
const type = ref(route.path.includes('activities') ? 'activity' : 'event');
const name = ref('');
const description = ref('');
const note = ref('');
const startingDate = ref('');
const endingDate = ref('');
const maxParticipants = ref('');
const store = useEventsActivitiesStore();

const cleanAndFormatInput = (input: string): string => {
  const cleanedValue = input.replace(/[^\d,]/g, '');
  const normalizedValue = cleanedValue.replace(',', '.');
  const numericValue = parseFloat(normalizedValue);

  return isNaN(numericValue) || numericValue === 0
    ? '0'
    : numericValue.toLocaleString('it-IT');
};

const handleMaxParticipants = (value: string | number | null) => {
  const val = typeof value === 'string' ? value : String(value);
  maxParticipants.value = cleanAndFormatInput(val);
};

const validateInputs = () => {
  const hasErrors = !name.value.trim() ||
    !description.value.trim() ||
    !note.value.trim() ||
    !startingDate.value ||
    !endingDate.value ||
    new Date(endingDate.value) <= new Date(startingDate.value) ||
    !maxParticipants.value ||
    parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')) <= 0;

  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors }
  }));
};

watch([name, description, note, startingDate, endingDate, maxParticipants], () => {
  validateInputs();
});

const saveToLocalStorage = () => {
  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const eventData = {
    type: type.value,
    name: name.value.trim(),
    description: description.value.trim(),
    note: note.value.trim(),
    maxParticipants: parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')),
    startingDate: startingDate.value,
    endingDate: endingDate.value,
  };

  if (store.eventsActivities[currentIndex]) {
    store.eventsActivities[currentIndex] = {
      ...store.eventsActivities[currentIndex],
      ...eventData
    };
    localStorage.setItem('eventsActivities', JSON.stringify(store.eventsActivities));
  } else {
    store.addEventActivity(eventData);
  }
};

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const savedEventActivity = store.eventsActivities[currentIndex];

  if (savedEventActivity) {
    name.value = savedEventActivity.name;
    description.value = savedEventActivity.description;
    note.value = savedEventActivity.note;
    startingDate.value = savedEventActivity.startingDate;
    endingDate.value = savedEventActivity.endingDate;
    maxParticipants.value = savedEventActivity.maxParticipants.toLocaleString('it-IT');
  }
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss">
.small-containers {
  flex-grow: 1;
  display: flex;
  padding: 1rem 2rem 2rem 2rem;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  width: 50% !important;
}

.border-primary-left {
  position: relative;
}

.border-primary-left::before {
  content: '';
  position: absolute;
  left: 0;
  top: 5%;
  height: 90%;
  width: 2px;
  background-color: $border-color;
}

@media (max-width: 637px) {
  .border-primary-left::before {
    display: none;
  }
}
</style>
