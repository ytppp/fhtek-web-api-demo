<template>
  <div class="table">
    <div class="table__header" v-if="showHeader">
      <div class="table__title" v-if="title || $slots.title">
        <template v-if="title"> {{ title }} </template>
        <slot name="title" v-else></slot>
      </div>
      <div class="table__operation-group" v-if="$slots.operationgroup">
        <slot name="operationgroup"></slot>
      </div>
    </div>
    <div class="table__main" ref="tableWrap" @scroll="handleScroll">
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        ref="scrollTable"
        class="table-main"
        :class="{ 'is-border': border }"
      >
        <thead class="table-main__header">
          <tr class="table-main__header-row" v-if="showTableHeader">
            <th
              class="table-main__cell table-main__checkbox"
              :class="{
                'table-main__cell--fixed table-main__cell--fixed-left table-main__cell--fixed-left-last':
                  isFixedLeft,
              }"
              ref="checkboxCol"
              v-if="isShowRowCheckbox"
            >
              <div class="com-cell" :style="cellStyle"></div>
            </th>
            <th class="table-main__cell table-main__index" v-if="isShowIndex">
              <div class="com-cell" :style="cellStyle">{{ $t('trans0454') }}</div>
            </th>
            <th
              class="table-main__cell"
              v-for="col in columns"
              :key="col.key"
              :title="col.title"
              :style="getItemStyle(col)"
            >
              <div class="cell" :style="cellStyle">{{ col.title }}</div>
            </th>
            <th
              class="table-main__cell"
              :class="{
                'table-main__cell--fixed table-main__cell--fixed-right table-main__cell--fixed-right-last':
                  isFixedRight,
              }"
              ref="headerOperationCol"
              v-if="isShowOperation"
            >
              <div class="com-cell" :style="cellStyle">{{ $t('trans0141') }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="table-main__content">
          <template v-if="dataSource.length">
            <tr
              v-for="(item, index) in dataSource"
              :key="index"
              class="table-main__content-row"
              :class="{
                'is-stripe': stripe && (index + 1) % 2 === 0,
                'is-hover': hover,
              }"
            >
              <td
                class="table-main__cell table-main__checkbox"
                :class="{
                  'table-main__cell--fixed table-main__cell--fixed-left table-main__cell--fixed-left-last':
                    isFixedLeft,
                }"
                v-if="isShowRowCheckbox"
              >
                <div class="com-cell" :style="cellStyle">
                  <fh-checkbox @change="(val) => select(val, item)" />
                </div>
              </td>
              <td class="table-main__cell table-main__index" v-if="isShowIndex">
                <div class="com-cell" :style="cellStyle">{{ index + 1 }}</div>
              </td>
              <td
                class="table-main__cell"
                v-for="col in columns"
                :key="col.key"
                :style="getItemStyle(col)"
              >
                <div :style="cellStyle" v-if="col.render">
                  <fh-table-column-render
                    :column="col"
                    :row="item"
                    :index="col.key"
                    :render="col.render"
                  ></fh-table-column-render>
                </div>
                <div class="cell" :style="cellStyle" :title="item[col.key]" v-else>
                  {{ item[col.key] }}
                </div>
              </td>
              <td
                class="table-main__cell"
                :class="{
                  'table-main__cell--fixed table-main__cell--fixed-right table-main__cell--fixed-right-last':
                    isFixedRight,
                }"
                ref="rowOperationCol"
                v-if="isShowOperation"
              >
                <div class="com-cell" :style="cellStyle">
                  <slot name="operation" :row="item"></slot>
                </div>
              </td>
            </tr>
          </template>
          <tr class="table-main__content-row empty-row" v-else>
            <td class="empty-row__cell" :colspan="columnsTotal">
              {{ $t('trans0142') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table__footer" v-if="footer || $slots.footer">
      <template v-if="footer"> {{ footer }} </template>
      <slot name="footer" v-else></slot>
    </div>
  </div>
</template>

<script>
import FhTableColumnRender from './table-column-render.js'

export default {
  name: 'FhTable',
  components: {
    FhTableColumnRender,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    title: String,
    footer: String,
    showIndex: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: false,
    },
    showTableHeader: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showRowCheckbox: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: 'center',
      validator: function (value) {
        return ['left', 'center', 'right'].indexOf(value) !== -1
      },
    },
  },
  data() {
    return {
      listSelected: [],
      isScrollLeft: false,
      isScrollRight: false,
      isShowScroll: false,
    }
  },
  computed: {
    isFixedLeft() {
      return this.fixed && this.isShowScroll && this.showRowCheckbox && this.isScrollRight
    },
    isFixedRight() {
      return this.fixed && this.isShowScroll && this.$slots.operation && this.isScrollLeft
    },
    isShowOperation() {
      return this.$slots.operation()
    },
    isShowIndex() {
      return this.showIndex
    },
    isShowRowCheckbox() {
      return this.showRowCheckbox && this.dataSource.length
    },
    cellStyle() {
      return {
        textAlign: this.align,
        height: '100%',
      }
    },
    columnsTotal() {
      let total = 0
      if (this.isShowOperation) {
        total += 1
      }
      if (this.isShowIndex) {
        total += 1
      }
      if (this.isShowRowCheckbox) {
        total += 1
      }
      total += this.columns.length
      return total
    },
  },
  emits: ['select'],
  methods: {
    getItemStyle(col) {
      return this.dataSource.length
        ? {
            width: col.width && `${col.width}px`,
            maxWidth: col.width && `${col.width}px`,
          }
        : {}
    },
    handleScroll() {
      if (!this.isShowScroll) {
        return
      }
      const offset = 20
      let offsetLeft = 0
      let offsetRight = 0
      if (this.$refs.checkboxCol) {
        const checkboxColClientWidth = this.$refs.checkboxCol.clientWidth
        offsetLeft = Math.min(checkboxColClientWidth, offset)
      }
      if (this.$refs.headerOperationCol) {
        const operationColClientWidth = this.$refs.headerOperationCol.clientWidth
        offsetRight = Math.min(operationColClientWidth, offset)
      }
      const clientWidth = this.$refs.tableWrap.clientWidth
      const scrollLeft = this.$refs.tableWrap.scrollLeft
      const scrollWidth = this.$refs.tableWrap.scrollWidth
      const offsetWidth = scrollWidth - clientWidth - offsetRight
      if (scrollLeft > offsetLeft) {
        this.isScrollRight = true
      } else {
        this.isScrollRight = false
      }
      if (scrollLeft < offsetWidth) {
        this.isScrollLeft = true
      } else {
        this.isScrollLeft = false
      }
    },
    select(val, row) {
      if (val && !this.listSelected.includes(row)) {
        this.listSelected.push(row)
      } else if (!val && this.listSelected.includes(row)) {
        this.listSelected.splice(this.listSelected.indexOf(row), 1)
      }
      this.$emit('select', this.listSelected)
    },
  },
  mounted() {
    this.isShowScroll = this.$refs.scrollTable.scrollWidth > this.$refs.tableWrap.clientWidth
    if (this.isShowScroll) {
      this.isScrollLeft = true
    }
  },
}
</script>

<style lang="less">
.table {
  border-radius: 8px;
  width: 100%;
  .table__header {
    position: relative;
    height: 85px;
  }
  .table__title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    text-align: center;
    color: #262626;
    @media screen and (max-width: 768px) {
      justify-content: flex-start;
    }
  }
  .table__operation-group {
    position: absolute;
    top: 20px;
    right: 0;
  }
  .table__main {
    min-width: 100%;
    overflow-x: auto;
  }
  .table__footer {
    padding: 10px;
  }
  .table-main {
    table-layout: fixed;
    border-collapse: separate;
    box-sizing: border-box;
    min-width: 100%;
    &.is-border {
      border: 1px solid #c9c9c9;
      .table-main__header-row,
      .table-main__content-row {
        th,
        td {
          border-right: 1px solid #c9c9c9;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    .table-main__header-row {
      background-color: @table-background-color;
      .table-main__cell {
        font-weight: 400;
      }
    }
    .table-main__content-row {
      background-color: @table-background-color;
      &:last-child {
        .table-main__cell {
          border-bottom: none;
        }
      }
      &.is-stripe {
        background-color: #fafafa;
      }
      &.is-hover {
        &:hover {
          background-color: #f5f7fa;
        }
      }
      &.empty-row {
        .empty-row__cell {
          height: 80px;
          vertical-align: middle;
          text-align: center;
          color: #666;
          font-size: 16px;
        }
      }
    }
    .table-main__cell {
      z-index: 1;
      padding: 12px 0;
      font-size: 16px;
      color: #262626;
      border-bottom: 1px solid #c9c9c9;
      &.table-main__cell--fixed {
        position: sticky;
        z-index: 2;
        background-color: @table-background-color;
        &.table-main__cell--fixed-left {
          left: -1px;
          &.table-main__cell--fixed-left-last {
            &::after {
              position: absolute;
              top: 0;
              right: 0;
              bottom: -1px;
              width: 30px;
              transform: translate(100%);
              transition: box-shadow 0.3s;
              content: '';
              pointer-events: none;
              box-shadow: inset 10px 0 8px -8px #ccc;
            }
          }
        }
        &.table-main__cell--fixed-right {
          right: -1px;
          &.table-main__cell--fixed-right-last {
            &::after {
              position: absolute;
              top: 0;
              bottom: -1px;
              left: 0;
              width: 30px;
              transform: translate(-100%);
              transition: box-shadow 0.3s;
              content: '';
              pointer-events: none;
              box-shadow: inset -10px 0 8px -8px #ccc;
            }
          }
        }
      }
    }
    .table-main__index,
    .table-main__checkbox {
      width: 50px;
      min-width: 50px;
    }
  }
  .com-cell {
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    white-space: nowrap;
  }
  .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
