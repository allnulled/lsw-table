Vue.component("LswTable", {
  template: $template,
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