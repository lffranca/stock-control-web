<template>
  <q-page padding>
    <q-table
      title="Products"
      :data="data"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :selected.sync="selected"
      :loading="loading"
      :pagination.sync="pagination"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Products</div>
        <div v-if="$q.screen.gt.xs" class="col">
          <q-btn flat round color="primary" icon="edit" :disable="!(selected.length === 1)" @click="openModal(selected[0])" />
          <q-btn flat round color="red" icon="delete" :disable="!(selected.length > 0)" @click="onDelete()" />
        </div>
        <q-space />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Item
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            v-model="item.brand"
            label="Brand"
          />
          <br/>
          <q-select outlined v-model="item.volume" :options="['250ml', '600ml', '1l']" label="Outlined" />
          <br/>
          <q-select outlined v-model="item.type" :options="['PET', 'GARRAFA', 'LATA']" label="Outlined" />
          <br/>
          <q-input
            outlined
            v-model="item.quantity"
            label="Quantity"
            type="number"
          />
          <br/>
          <q-input
            outlined
            v-model="item.unit_value"
            label="Value"
            prefix="R$"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn :loading="loadingSave" color="primary" @click="saveItem()" label="Save" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="openModal()" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

import {URL_API, DATA_API} from '../constants/url-constant'
import {STORAGE_AUTH} from '../constants/storage-constant'

const createUser = () => {
  return {
    id: null,
    brand: "",
    volume: "",
    type: "",
    quantity: 0,
    unit_value: 0,
  }
}

export default {
  name: 'PageIndex',
  mounted () {
    const {pagination} = this
    this.onRequest({pagination})
  },
  methods: {
    async updateItem() {
      try {
        const {item} = this

        console.log(item, Number.isInteger(item.quantity), Number.isNaN(item.unit_value))

        if (!item.brand || !item.volume || !item.type) {
          Notify.create({
            message: 'All fields are required!',
            position: 'top-right',
            color: 'red'
          })
          return
        }

        this.loadingSave = true
        const authData = JSON.parse(localStorage.getItem(STORAGE_AUTH))

        const URL = `${URL_API}/api/product/${item.id}`

        await axios.put(
          URL,
          {
            ...item
          },
          {
            headers: {
              'Authorization': `${authData.token_type} ${authData.access_token}`
            }
          }
        )

        Notify.create({
          message: 'Success!',
          position: 'top-right',
          color: 'green'
        })

        this.selected = []
        this.loadingSave = false
        this.modal = false
        this.item = createUser()

        const {pagination, filter} = this
        this.onRequest({pagination, filter})
      } catch (error) {
        console.log(error)
        this.loadingSave = false
        Notify.create({
          message: 'Error save!',
          position: 'top-right',
          color: 'red'
        })
      }
    },
    async createItem() {
      try {
        const {item} = this

        console.log(item, Number.isInteger(item.quantity), Number.isNaN(item.unit_value))

        if (!item.brand || !item.volume || !item.type) {
          Notify.create({
            message: 'All fields are required!',
            position: 'top-right',
            color: 'red'
          })
          return
        }

        this.loadingSave = true
        const authData = JSON.parse(localStorage.getItem(STORAGE_AUTH))

        const URL = `${URL_API}/api/product`

        await axios.post(
          URL,
          {
            ...item
          },
          {
            headers: {
              'Authorization': `${authData.token_type} ${authData.access_token}`
            }
          }
        )

        Notify.create({
          message: 'Success!',
          position: 'top-right',
          color: 'green'
        })

        this.selected = []
        this.loadingSave = false
        this.modal = false
        this.item = createUser()

        const {pagination, filter} = this
        this.onRequest({pagination, filter})
      } catch (error) {
        console.log(error)
        this.loadingSave = false
        Notify.create({
          message: 'Error save!',
          position: 'top-right',
          color: 'red'
        })
      }
    },
    async saveItem() {
      if (this.item.id) {
        this.updateItem()
      } else {
        this.createItem()
      }
    },
    openModal(item) {
      this.modal = true

      if (item) {
        console.log(item)
        this.item = {...item}
      } else {
        this.item = createUser()
      }
    },
    async onRequest(props) {
      try {
        const { page, rowsPerPage } = props.pagination

        this.loading = true
        const authData = JSON.parse(localStorage.getItem(STORAGE_AUTH))

        if (props.filter && props.filter.length > 0) {
          const url_get = `${URL_API}/api/product/search`

          const {data} = await axios.get(url_get, {
            params: {
              search: props.filter
            },
            headers: {
              'Authorization': `${authData.token_type} ${authData.access_token}`
            }
          })


          this.data = data
          this.pagination = {
            ...props.pagination,
            rowsPerPage: data.length,
            rowsNumber: data.length
          }
        } else {
          const rowsPerPageToGET = rowsPerPage > 0 ? rowsPerPage : 1000

          const url_get = `${URL_API}/api/product/${(page-1) * rowsPerPage}/${rowsPerPageToGET}`

          const {data} = await axios.get(url_get, {
            headers: {
              'Authorization': `${authData.token_type} ${authData.access_token}`
            }
          })

          const {items, total} = data

          this.data = items
          this.pagination = {
            ...props.pagination,
            rowsNumber: total
          }
        }

        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
        Notify.create({
          message: 'Error request data!',
          position: 'top-right',
          color: 'red'
        })
      }
    },
    async onDelete() {
      try {
        if (this.selected.length <= 0) {
          return
        }

        this.loading = true
        const authData = JSON.parse(localStorage.getItem(STORAGE_AUTH))

        const url_get = `${URL_API}/api/product/destroy-all`

        await axios.post(
          url_get,
          {
            ids: this.selected.map(i => i.id)
          },
          {
            headers: {
              'Authorization': `${authData.token_type} ${authData.access_token}`
            }
          }
        )

        this.loading = false
        this.selected = []

        const {pagination, filter} = this

        this.onRequest({pagination, filter})
      } catch (error) {
        console.log(error)
        this.loading = false
        Notify.create({
          message: 'Error request!',
          position: 'top-right',
          color: 'red'
        })
      }
    }
  },
  data() {
    return {
      modal: false,
      item: createUser(),
      selected: [],
      filter: '',
      loading: false,
      loadingSave: false,
      pagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: false
      },
      columns: [
        {
          name: 'brand',
          required: true,
          label: 'Brand',
          align: 'left',
          field: row => row.brand,
          format: val => `${val}`,
          sortable: false
        },
        { name: 'volume', align: 'right', label: 'Volume', field: 'volume', sortable: false },
        { name: 'type', align: 'right', label: 'Type', field: 'type', sortable: false },
        { name: 'quantity', align: 'right', label: 'Quantity', field: 'quantity', sortable: false },
        { name: 'unit_value', align: 'right', label: 'Value', field: 'unit_value', sortable: false, format: val => `R$ ${val}`, },
        { name: 'created_at', align: 'right', label: 'Created at', field: 'created_at', sortable: false },
        { name: 'updated_at', align: 'right', label: 'Updated at', field: 'updated_at', sortable: false },
      ],
      data: []
    }
  }
}
</script>
