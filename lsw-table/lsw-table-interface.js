(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTableInterface'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTableInterface'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const LswTableInterface = {};

  LswTableInterface.data = function () {
    this.$trace("lsw-table.data");
    return {
      input: "",
      title: this.initialSettings?.title || "",
      isShowingMenu: this.initialSettings?.isShowingMenu || false,
      isShowingSubpanel: this.initialSettings?.isShowingSubpanel || "Extensor",
      selectedRows: [],
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
  };
  LswTableInterface.props = {
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
      type: Number,
      default: () => 0
    }
  };

  LswTableInterface.methods = {};
  LswTableInterface.methods.getPredata = function() {
    this.$trace("lsw-table.methods.getPredata");
    const input = [].concat(this.initialInput);
    return {
      input
    };
  };

  LswTableInterface.methods.goToFirstPage = function () {
    this.$trace("lsw-table.methods.goToFirstPage");
    this.currentPage = 0;
  };

  LswTableInterface.methods.decreasePage = function () {
    this.$trace("lsw-table.methods.decreasePage");
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  };

  LswTableInterface.methods.increasePage = function () {
    this.$trace("lsw-table.methods.increasePage");
    const lastPage = Math.floor(this.output.length / this.itemsPerPage);
    if (this.currentPage < lastPage) {
      this.currentPage++;
    }
  };

  LswTableInterface.methods.goToLastPage = function () {
    this.$trace("lsw-table.methods.goToLastPage");
    const lastPage = Math.floor(this.output.length / this.itemsPerPage);
    if (this.currentPage !== lastPage) {
      this.currentPage = lastPage;
    }
  };

  LswTableInterface.methods.toggleRow = function (rowIndex) {
    this.$trace("lsw-table.methods.toggleRow");
    const pos = this.selectedRows.indexOf(rowIndex);
    if (pos === -1) {
      this.selectedRows.push(rowIndex);
    } else {
      this.selectedRows.splice(pos, 1);
    }
  };

  LswTableInterface.methods.toggleMenu = function () {
    this.$trace("lsw-table.methods.toggleMenu");
    this.isShowingMenu = !this.isShowingMenu;
  };

  LswTableInterface.methods.digestOutput = function () {
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
        if (Array.isArray(this.columnsOrder) && this.columnsOrder.length) {
          tempHeaders = [...tempHeaders].sort((h1, h2) => {
            const pos1 = this.columnsOrder.indexOf(h1);
            const pos2 = this.columnsOrder.indexOf(h2);
            if (pos1 === -1 && pos2 === -1) {
              return -1;
            } else if (pos1 === -1) {
              return 1;
            } else if (pos2 === -1) {
              return -1;
            } else if (pos1 > pos2) {
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
  };

  LswTableInterface.methods.digestPagination = function () {
    this.$trace("lsw-table.methods.digestPagination");
    const page = this.currentPage;
    const items = this.itemsPerPage;
    const firstPosition = items * (page);
    this.selectedRows = [];
    this.paginatedOutput = [].concat(this.output).splice(firstPosition, items);
  };

  LswTableInterface.methods.saveCurrentTransformer = function () {
    this.$trace("lsw-table.methods.saveCurrentTransformer");
  };

  LswTableInterface.methods._adaptRowButtonsToHeaders = function (rowButtons) {
    this.$trace("lsw-table.methods._adaptRowButtonsToHeaders");
    const attachedHeaders = [];
    for (let index = 0; index < rowButtons.length; index++) {
      const attachedButton = rowButtons[index];
      attachedHeaders.push({
        text: attachedButton.header || ""
      });
    }
    return attachedHeaders;
  };

  LswTableInterface.methods._adaptRowButtonsToColumns = function (rowButtons) {
    this.$trace("lsw-table.methods._adaptRowButtonsToColumns");
    const attachedColumns = [];
    for (let index = 0; index < rowButtons.length; index++) {
      const attachedButton = rowButtons[index];
      attachedColumns.push({
        text: attachedButton.text || "",
        event: attachedButton.event || this.$noop,
      });
    }
    return attachedColumns;
  };

  LswTableInterface.watch = {};
  LswTableInterface.watch.itemsPerPage = function (value) {
    this.$trace("lsw-table.watch.itemsPerPage");
    this.digestPagination();
  };

  LswTableInterface.watch.currentPage = function (value) {
    this.$trace("lsw-table.watch.currentPage");
    this.digestPagination();
  };

  LswTableInterface.computed = {};
  LswTableInterface.computed.hasFiltersApplying = function () {
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
  };

  LswTableInterface.mounted = function () {
    this.$trace("lsw-table.mounted");
    this.digestOutput();
  };

  return LswTableInterface;

});