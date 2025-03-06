/*
  @artifact:  Lite Starter Web Dependency
  @url:       https://github.com/allnulled/lsw-table.git
  @name:      @allnulled/lsw-table
  @version:   1.0.0
*/(function(factory) {
  const mod = factory();
  if(typeof window !== 'undefined') {
    window["Lsw_form_controls_components"] = mod;
  }
  if(typeof global !== 'undefined') {
    global["Lsw_form_controls_components"] = mod;
  }
  if(typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function() {
Vue.component("LswTable", {
  template: `<div class="lsw_table"
    style="padding-top: 4px;">
    <div class="position_relative">
        <div class="position_absolute top_0 right_0"
            style="font-size: 16px; padding: 3px;">
            <span class="bordered_1 cursor_pointer"
                v-on:click="digestOutput">🛜</span>
        </div>
    </div>
    <table class="collapsed_table lsw_table_itself">
        <thead>
            <tr>
                <th style="width: 1%; padding: 0px;">
                    <button class="table_menu_div width_100"
                        v-on:click="toggleMenu"
                        :class="{activated: isShowingMenu === true}">
                        <span v-if="hasFiltersApplying">🟡</span>
                        <span v-else>⚪️</span>
                    </button>
                </th>
                <th class="table_header"
                    v-for="header, headerIndex in headers"
                    v-bind:key="'header-' + headerIndex">
                    <div>{{ header }}</div>
                </th>
                <th style="width: 100%; padding-right: 0px;">
                    <div class="flex_row centered">
                        <div class="flex_100">size of row</div>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody v-if="isShowingMenu">
            <tr>
                <td class="table_navigation_menu_cell"
                    colspan="1000">
                    <div class="table_navigation_menu">
                        <div class="flex_row centered">
                            <div class="flex_1 nowrap">Estás en: </div>
                            <div class="flex_100 left_padded_1">
                                <select class="width_100 text_align_center"
                                    v-model="isShowingSubpanel">
                                    <option value="Extensor">Extensor ({{ extender.length }})</option>
                                    <option value="Filtro">Filtro ({{ filter.length }})</option>
                                    <option value="Ordenador">Ordenador ({{ sorter.length }})</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="isShowingSubpanel === 'Extensor'">
                            <textarea spellcheck="false"
                                v-model="extender"></textarea>
                        </div>
                        <div v-if="isShowingSubpanel === 'Filtro'">
                            <textarea spellcheck="false"
                                v-model="filter"></textarea>
                        </div>
                        <div v-if="isShowingSubpanel === 'Ordenador'">
                            <textarea spellcheck="false"
                                v-model="sorter"></textarea>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
        <template v-if="paginatedOutput && headers">
            <tbody class="this_code_is_duplicated_always">
                <tr>
                    <td colspan="1000">
                        <div class="flex_row centered">
                            <div class="flex_1 pagination_button_box first_box">
                                <div class="pagination_button first_button"
                                    v-on:click="goToFirstPage">⏪</div>
                            </div>
                            <div class="flex_1 pagination_button_box">
                                <div class="pagination_button"
                                    v-on:click="decreasePage">◀️</div>
                            </div>
                            <div class="flex_100 text_align_center">Page {{ currentPage+1 }} out of {{ Math.ceil(output.length /
                                itemsPerPage) }}</div>
                            <div class="flex_1 pagination_button_box">
                                <div class="pagination_button"
                                    v-on:click="increasePage">▶️</div>
                            </div>
                            <div class="flex_1 pagination_button_box last_box">
                                <div class="pagination_button last_button"
                                    v-on:click="goToLastPage">⏩</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody>
                <template v-for="row, rowIndex in paginatedOutput">
                    <tr class="row_for_table"
                        :class="{ odd: rowIndex === 0 ? true : (rowIndex % 2 === 0) ? true : false }"
                        v-bind:key="'row-for-table-' + rowIndex">
                        <td class="index_cell">
                            <button v-on:click="() => toggleRow(rowIndex)"
                                :class="{activated: selectedRows.indexOf(rowIndex) !== -1}">
                                {{ rowIndex + (currentPage * itemsPerPage) }}
                            </button>
                        </td>
                        <td v-for="columnKey, columnIndex in headers"
                            v-bind:key="'column-' + columnIndex">
                            {{ row[columnKey] ?? "-" }}
                        </td>
                        <td>
                            {{ JSON.stringify(row).length }} bytes
                        </td>
                    </tr>
                    <tr class="row_for_details"
                        v-show="selectedRows.indexOf(rowIndex) !== -1"
                        v-bind:key="'row-for-cell-' + rowIndex">
                        <td class="data_cell"
                            colspan="1000">
                            <pre class="">{{ JSON.stringify(row, null, 2) }}</pre>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tbody class="this_code_is_duplicated_always">
                <tr>
                    <td colspan="1000">
                        <div class="flex_row centered">
                            <div class="flex_1 pagination_button_box first_box">
                                <div class="pagination_button first_button"
                                    v-on:click="goToFirstPage">⏪</div>
                            </div>
                            <div class="flex_1 pagination_button_box">
                                <div class="pagination_button"
                                    v-on:click="decreasePage">◀️</div>
                            </div>
                            <div class="flex_100 text_align_center">Page {{ currentPage+1 }} out of {{ Math.ceil(output.length /
                                itemsPerPage) }}</div>
                            <div class="flex_1 pagination_button_box">
                                <div class="pagination_button"
                                    v-on:click="increasePage">▶️</div>
                            </div>
                            <div class="flex_1 pagination_button_box last_box">
                                <div class="pagination_button last_button"
                                    v-on:click="goToLastPage">⏩</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </template>
        <tbody v-else>
            <tr>
                <td colspan="1000">
                    Aguarde: la tabla está cargando...
                </td>
            </tr>
        </tbody>
    </table>
</div>`,
  props: {
    initialInput: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.$trace("lsw-table.data");
    const input = [].concat(this.initialInput);
    return {
      input,
      isShowingMenu: false,
      isShowingSubpanel: "none",
      selectedRows: [],
      extender: "",
      filter: "",
      sorter: "",
      itemsPerPage: 10,
      currentPage: 0,
      output: [],
      paginatedOutput: [],
      headers: [],
    };
  },
  methods: {
    goToFirstPage() {
      this.$trace("lsw-table.methods.goToFirstPage");
      this.currentPage = 0;
    },
    decreasePage() {
      this.$trace("lsw-table.methods.decreasePage");
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    increasePage() {
      this.$trace("lsw-table.methods.increasePage");
      const lastPage = Math.floor(this.output.length / this.itemsPerPage);
      if (this.currentPage < lastPage) {
        this.currentPage++;
      }
    },
    goToLastPage() {
      this.$trace("lsw-table.methods.goToLastPage");
      const lastPage = Math.floor(this.output.length / this.itemsPerPage);
      if (this.currentPage !== lastPage) {
        this.currentPage = lastPage;
      }
    },
    toggleRow(rowIndex) {
      this.$trace("lsw-table.methods.toggleRow");
      const pos = this.selectedRows.indexOf(rowIndex);
      if (pos === -1) {
        this.selectedRows.push(rowIndex);
      } else {
        this.selectedRows.splice(pos, 1);
      }
    },
    toggleMenu() {
      this.$trace("lsw-table.methods.toggleMenu");
      this.isShowingMenu = !this.isShowingMenu;
    },
    digestOutput() {
      this.$trace("lsw-table.methods.digestOutput");
      const input = this.input;
      let temp = [];
      const extenderExpression = this.extender.trim() || "{}";
      const extenderFunction = new Function("it", "i", `return ${extenderExpression}`);
      const filterExpression = this.filter.trim() || "true";
      const filterFunction = new Function("it", "i", `return ${filterExpression}`);
      const sorterExpression = this.sorter.trim() || "0";
      const sorterFunction = new Function("a", "b", `return ${sorterExpression}`);
      let tempHeaders = new Set();
      for (let index = 0; index < input.length; index++) {
        const row = input[index];
        let extendedRow = undefined;
        Apply_extender: {
          try {
            const extenderProduct = extenderFunction(row, index) || {};
            extendedRow = Object.assign({}, row, extenderProduct);
          } catch (error) {
            extendedRow = Object.assign({}, row);
          }
        }
        Apply_filter: {
          try {
            const filterProduct = filterFunction(extendedRow, index);
            if (filterProduct === true) {
              temp.push(extendedRow);
            }
          } catch (error) {
            // @OK.
          }
        }
        Extract_headers: {
          try {
            Object.keys(extendedRow).forEach(key => {
              tempHeaders.add(key);
            });
          } catch (error) {
            // @OK.
          }
        }
      }
      Apply_sorter: {
        try {
          temp = temp.sort(sorterFunction);
        } catch (error) {
          // @OK.
        }
      }
      this.headers = tempHeaders;
      this.output = temp;
      this.digestPagination();
    },
    digestPagination() {
      this.$trace("lsw-table.methods.digestPagination");
      const page = this.currentPage;
      const items = this.itemsPerPage;
      const firstPosition = items * (page);
      this.selectedRows = [];
      this.paginatedOutput = [].concat(this.output).splice(firstPosition, items);
    },
    saveCurrentTransformer() {
      this.$trace("lsw-table.methods.saveCurrentTransformer");
    }
  },
  watch: {
    itemsPerPage(value) {
      this.$trace("lsw-table.watch.itemsPerPage");
      this.digestPagination();
    },
    currentPage(value) {
      this.$trace("lsw-table.watch.currentPage");
      this.digestPagination();
    }
  },
  computed: {
    hasFiltersApplying() {
      this.$trace("lsw-table.computed.hasFiltersApplying");
      if (this.extender.length) {
        return true;
      }
      if (this.filter.length) {
        return true;
      }
      if (this.sorter.length) {
        return true;
      };
      return false;
    }
  },
  mounted() {
    this.$trace("lsw-table.mounted");
    this.digestOutput();
  }
});
Vue.component("LswTableTransformers", {
  template: `<div class="lsw_table_transformers">
    Transformers here.
    {{ table.transformers }}
    <div class="flex_row">
        <button class="button_separation" v-on:click="table.showTransformers">All: {{ table.transformers.length }}</button>
        <button class="button_separation" v-on:click="table.askForFilter">+Filter</button>
        <button class="button_separation" v-on:click="table.askForMapper">+Mapper</button>
        <button class="button_separation" v-on:click="table.askForReducer">+Reducer</button>
        <button class="button_separation" v-on:click="table.askForSorter">+Sorter</button>
        <button class="button_separation" v-on:click="table.askForGrouper">+Grouper</button>
        <div style="flex: 100;"></div>
    </div>
</div>`,
  props: {
    table: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    };
  },
  methods: {

  },
  watch: {

  },
  mounted() {

  }
});
});

