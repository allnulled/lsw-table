Vue.component("LswTable", {
  template: $template,
  props: {
    initialInput: {
      type: Array,
      default: () => []
    },
    initialSettings: {
      type: Object,
      default: () => ({})
    },
    rowButtons: {
      type: Array,
      default: () => []
    },
    tableButtons: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: String,
      default: () => "none"
    },
    onChooseRow: {
      type: Function,
      default: () => {}
    },
    choosableId: {
      type: String,
      default: () => "id"
    },
    initialChoosenValue: {
      type: [],
      default: () => []
    }
  },
  data() {
    this.$trace("lsw-table.data");
    const input = [].concat(this.initialInput);
    return {
      input,
      title: this.initialSettings?.title || "",
      isShowingMenu: this.initialSettings?.isShowingMenu || false,
      isShowingSubpanel: this.initialSettings?.isShowingSubpanel || "Extensor",
      selectedRows: [],
      choosenRows: this.initialChoosenValue || [],
      extender: this.initialSettings?.extender || "",
      filter: this.initialSettings?.filter || "",
      sorter: this.initialSettings?.sorter || "",
      itemsPerPage: this.initialSettings?.itemsPerPage || 10,
      currentPage: this.initialSettings?.currentPage || 0,
      columnsAsList: this.initialSettings?.columnsAsList || [],
      columnsOrder: this.initialSettings?.columnsOrder || [],
      output: [],
      paginatedOutput: [],
      headers: [],
      attachedHeaders: this._adaptRowButtonsToHeaders(this.rowButtons),
      attachedColumns: this._adaptRowButtonsToColumns(this.rowButtons),
      attachedTopButtons: this._adaptRowButtonsToColumns(this.tableButtons),
      placeholderForExtensor: "data.map(function(it, i) {\n  return /* you start here */ || {};\n});",
      placeholderForOrdenador: "data.sort(function(a, b) {\n  return /* you start here */;\n});",
      placeholderForFiltro: "data.filter(function(it, i) {\n  return /* you start here */;\n});",
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
    toggleChoosenRow(rowId) {
      this.$trace("lsw-table.methods.toggleChoosenRow");
      if(this.selectable === 'many') {
        const pos = this.choosenRows.indexOf(rowId);
        if (pos === -1) {
          this.choosenRows.push(rowId);
        } else {
          this.choosenRows.splice(pos, 1);
        }
      } else if(this.selectable === 'one') {
        const isSame = this.choosenRows === rowId;
        if(isSame) {
          this.choosenRows = undefined;
        } else {
          this.choosenRows = rowId;
        }
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
        Also_to_headers: {
          if(Array.isArray(this.columnsOrder) && this.columnsOrder.length) {
            tempHeaders = [...tempHeaders].sort((h1, h2) => {
              const pos1 = this.columnsOrder.indexOf(h1);
              const pos2 = this.columnsOrder.indexOf(h2);
              if(pos1 === -1 && pos2 === -1) {
                return -1;
              } else if(pos1 === -1) {
                return 1;
              } else if(pos2 === -1) {
                return -1;
              } else if(pos1 > pos2) {
                return 1;
              }
              return -1;
            });
          }
        }
      }
      this.headers = tempHeaders;
      this.output = temp;
      this.digestPagination();
    },
    digestPagination() {
      this.$trace("lsw-table.methods.digestPagination");
      console.log(1);
      const page = this.currentPage;
      console.log(2);
      const items = this.itemsPerPage;
      console.log(3);
      const firstPosition = items * (page);
      this.selectedRows = [];
      console.log(4);
      this.paginatedOutput = [].concat(this.output).splice(firstPosition, items);
      console.log(5);
    },
    saveCurrentTransformer() {
      this.$trace("lsw-table.methods.saveCurrentTransformer");
    },
    _adaptRowButtonsToHeaders(rowButtons) {
      const attachedHeaders = [];
      for(let index=0; index<rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedHeaders.push({
          text: attachedButton.header || ""
        });
      }
      return attachedHeaders;
    },
    _adaptRowButtonsToColumns(rowButtons) {
      const attachedColumns = [];
      for(let index=0; index<rowButtons.length; index++) {
        const attachedButton = rowButtons[index];
        attachedColumns.push({
          text: attachedButton.text || "",
          event: attachedButton.event || this.$noop,
        });
      }
      return attachedColumns;
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
    },
    choosenRows(v) {
      this.$trace("lsw-table.watch.value");
      this.onChooseRow(v, this);
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