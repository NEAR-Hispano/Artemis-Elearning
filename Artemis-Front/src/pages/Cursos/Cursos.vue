<template>
  <section id="cursos" class="subparent divcol gap">
    <v-col class="align divwrap gap acenter">
      <a class="h8-em notdefault-clr hover-line" @click="clear()">Clear All</a>
      <v-text-field
        v-model="search"
        dense
        filled
        shaped
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by author.."
        v-on:input="searchByAuthor(search)"
      ></v-text-field>

      <div class="contFilters divrow gap spacemobile fill-wmobile">
        <v-select
          v-model="category_id"
          :items="filter.categories"
          item-text="name"
          item-value="id"
          label="Categorie"
          filled
          dense
          shaped
          hide-details
          background-color="var(--clr-card-2)"
          class="filterCategories"
          v-on:change="changeCategory(category_id)"
        >
          <template v-slot:[`slotProps.item`]>
            <span>{{ slotProps.item }}</span>
          </template>
        </v-select>
        
        <v-select
          v-model="price"
          :items="filter.price"
          label="Price"
          item-text="text"
          item-value="tipo"
          filled
          dense
          shaped
          hide-details
          background-color="var(--clr-card-2)"
          class="filterPrice"
          v-on:change="changePrice(price)"
          
        >
          <template v-slot:[`slotProps.item`]>
            <span>{{ slotProps.item }}</span>
          </template>
        </v-select>
      </div>
    </v-col>

    <!-- bajo modificacion -->
    <v-col class="wrapper">
      <v-card v-for="(item,i) in dataCursos" :key="i" :href="'#/curso/' + item.id"
        color="var(clr-card)" class="cartas align divcol" v-ripple="{ class: 'activeRipple' }">
        <img :src="item.img" alt="Imagen curso">
        <div class="divcol astart">
          <aside class="divcol">
            <span class="h7-em bold">{{item.title}}</span>
            <a :href="item.to" class="h9-em semibold" style="color: #FF6B3B !important">
              {{item.instructor }}
            </a>
          </aside>

          <aside class="space fill-w gap divwrapmobile">
            <span class="h5-em bold">{{formatPrice(item.price)}} 
              <span class="h10 normal">NEAR</span>
            </span>
            <v-rating
              v-model="item.rating"
              background-color="pink lighten-3"
              color="orange"
            ></v-rating>
          </aside>
        </div>
      </v-card>
    </v-col>
    <template>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="size_pagination"
            circle
            @input="pagination()"
          ></v-pagination>
        </div>
      </template>
  </section>
</template>

<script>
import * as nearAPI from 'near-api-js'
const { connect, keyStores, WalletConnection, Contract,utils } = nearAPI

const keyStore = new keyStores.BrowserLocalStorageKeyStore()
const config = {
        networkId: "testnet",
        keyStore, 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
export default {
  name: "Cursos",
  data() {
    return {
      page: 1,
      size_pagination: null,
      category_id: null,
      price: null,
      len_pagination: 0,
      limit: 6,
      search: null,
      filter: {
        categories: [],
        price: [{tipo: 1, text: 'Low to High'}, {tipo: 2, text: 'High to Low'}],
      },
      dataCursos: [],
    }
  },
  mounted () {
    this.getMarketCourses()
    this.get_categorys()
  },
  methods: {
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    clear() {
      this.category_id = null
      this.price = null
      this.search = null
      this.getMarketCourses(this.search, this.category_id)
    },
    pagination() {
      if (this.page === 1) {
        this.len_pagination = 0
      } else {
        this.len_pagination = (this.page - 1) * this.limit
      }
      this.price = null
      this.getMarketCourses(this.search, this.category_id)
    },
    async Search(search) {
      await this.getMarketCourses(null, this.category_id)
      await this.SearchArray(this.dataCursos, search)
    },
    SearchArray(array, search) {
      this.dataCursos = []
      this.dataCursos = array.filter(function(objeto){
        return objeto['title'].toLowerCase().includes(search.toLowerCase());
      });
    },
    async searchByAuthor(search) {
      this.page = 1
      this.search = search
      this.pagination()
    },    
    async changeCategory(id) {
      this.page = 1
      this.category_id = id
      this.pagination()
    },
    changePrice(tipo) {
      if (tipo === 1) {
        this.ArrayLowHigh(this.dataCursos, 'price')
      } else if (tipo === 2) {
        this.ArrayHighLow(this.dataCursos, 'price')
      }
    },
    ArrayLowHigh(array, variable) {
      array.sort(function (a, b) {
          return a[variable] - b[variable];
      });
    },
    ArrayHighLow(array, variable) {
      array.sort(function (a, b) {
          return b[variable] - a[variable];
      });
    },
    async get_categorys () {
      this.filter.categories = []
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      this.accountId = wallet.getAccountId()
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_category'],
        sender: wallet.account()
      })
      await contract.get_category().then((response) => {
        response.forEach((element) => {
          this.filter.categories.push({ id: element.id, name: element.name, img: element.img })
        })
      })
    },
    async sizePagination(creator, category) {
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_course_size'],
        sender: wallet.account()
      })
      await contract.get_course_size({
        creator_id: creator,
        category_id: category
      })
        .then((response) => {
          this.size_pagination = response / this.limit
          this.size_pagination = Math.ceil(this.size_pagination)
        })
    },
    async getMarketCourses(creator, category) {
      if (creator === '') {
        creator = null
      }
      this.dataCursos = []
      const CONTRACT_NAME = 'contract.e-learning.testnet'
      // connect to NEAR
      const near = await connect(config)
      // create wallet connection
      const wallet = new WalletConnection(near)
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ['get_market_courses'],
        sender: wallet.account()
      })
      await contract.get_market_courses({
        creator_id: creator,
        category_id: category,
        from_index: this.len_pagination,
        limit: this.limit
      })
        .then((response) => {
          for (var i = 0; i < response.length; i++) {
            var item = {}
            item.id = response[i].id
            item.instructor = response[i].creator_id
            item.title = response[i].title
            item.desc = response[i].short_description
            item.price = response[i].price
            item.img = response[i].img
            if (response[i].reviews === null) {
              item.rating = 0
            }
            this.dataCursos.push(item)
          }
          this.dataCursos = this.dataCursos.sort()
          this.sizePagination(creator, category)
         
        })
    },
  }
};
</script>

<style src="./Cursos.scss" lang="scss" />
