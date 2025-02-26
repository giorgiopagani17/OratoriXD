<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-input
            v-model="search"
            dense
            input-style="color: white;"
            :placeholder="$t('placeholders.search')"
            color="white"
            class="custom-input blue-container-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white"/>
            </template>
          </q-input>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <q-btn
            v-for="button in buttons"
            :key="button.title"
            :color="button.active ? 'secondary' : 'primary'"
            class="button q-mx-xs"
            style="width: 150px;"
            @click="toggleFilter(button)"
          >
            {{ $t(`buttons.${button.title}`) }}
          </q-btn>
        </div>
      </div>

      <q-table
        style="border-radius: 24px; min-height: 436px"
        class="q-mt-lg"
        :rows="rows"
        :columns="columns"
        row-key="name"
        flat
        bordered
        virtual-scroll
        :rows-per-page-options="[7, 15, 30, 50]"
        :rows-per-page-label="$t('labels.recordsPerPage')"
        :pagination="pagination"
        @update:pagination="onPaginationChange"
      >
        <template v-slot:header-cell="props">
          <q-th
            :props="props"
            class="bg-secondary text-white"
            style="font-size: 15px; font-weight: bold;"
          >
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center">
            {{ $t('errors.noUserFound') }}
          </div>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import type { QTableColumn } from 'quasar';
import usersData from '@/data/users.json';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserPage'
});

interface UserRow {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  email: string;
}

interface Button {
  title: string;
  action: string;
  active: boolean;
}

interface QPagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

const search = ref<string>('');
const allUsers = ref<UserRow[]>([]);
const rows = ref<UserRow[]>([]);
const { t } = useI18n();

const columns = computed<QTableColumn<UserRow>[]>(() => [
  { name: 'name', label: t('labels.name'), align: 'left', field: 'name', sortable: false },
  { name: 'age', label: t('labels.age'), align: 'left', field: 'age', sortable: false },
  { name: 'dateOfBirth', label: t('labels.dateOfBirth'), align: 'left', field: 'dateOfBirth', sortable: false },
  { name: 'gender', label: t('labels.gender'), align: 'left', field: 'gender', sortable: false },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: false },
]);

const buttons = ref<Button[]>([
  { title: 'major', action: 'over18', active: false },
  { title: 'minor', action: 'under18', active: false },
  { title: 'male', action: 'male', active: false },
  { title: 'female', action: 'female', active: false }
]);

const pagination = ref<QPagination>({
  rowsPerPage: 7,
  page: 1,
});

const onPaginationChange = (newPagination: QPagination) => {
  pagination.value = newPagination;
};

const toggleFilter = (button: Button) => {
  buttons.value = buttons.value.map(btn => ({
    ...btn,
    active: btn === button ? !btn.active : false
  }));
  applyFilters();
};

const applyFilters = () => {
  let filteredUsers = [...allUsers.value];

  const activeFilter = buttons.value.find(btn => btn.active);
  if (activeFilter) {
    switch (activeFilter.action) {
      case 'over18':
        filteredUsers = filteredUsers.filter(user => user.age >= 18);
        break;
      case 'under18':
        filteredUsers = filteredUsers.filter(user => user.age < 18);
        break;
      case 'male':
        filteredUsers = filteredUsers.filter(user => user.gender === 'Male');
        break;
      case 'female':
        filteredUsers = filteredUsers.filter(user => user.gender === 'Female');
        break;
    }
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  rows.value = filteredUsers;
};

watch(search, () => {
  applyFilters();
});

onMounted(() => {
  allUsers.value = usersData.users;
  rows.value = usersData.users;
});
</script>

<style lang="scss">
.q-table {
  table-layout: fixed;

  th, td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
  }

  td > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  thead tr th:nth-child(1) { width: 25%; }
  thead tr th:nth-child(2) { width: 10%; }
  thead tr th:nth-child(3) { width: 15%; }
  thead tr th:nth-child(4) { width: 15%; }
  thead tr th:nth-child(5) { width: 35%; }
}

.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
