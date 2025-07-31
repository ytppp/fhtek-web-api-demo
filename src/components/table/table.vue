<template>
  <div class="table">
    <div class="table__header" v-if="showHeader">
      <div class="table__filter-group" v-if="$slots.filtergroup">
        <slot name="filtergroup"></slot>
      </div>
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
        :class="{ 'is-border': border || maxLevel > 1 }"
      >
        <thead class="table-main__header" v-if="showTableHeader">
          <tr class="table-main__header-row" v-for="(row, rowIndex) in headerRows" :key="rowIndex">
            <template v-for="(col, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
              <th
                class="table-main__cell table-main__checkbox"
                :class="{
                  'table-main__cell--fixed': isFixedLeft(col),
                  'table-main__cell--fixed-left-last': isFixedLeftLast(colIndex),
                }"
                :style="`${isFixedLeft(col) ? 'position: sticky; left: 0' : ''}`"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="checkboxCol"
                v-if="col.key === 'checkbox'"
              >
                <div class="com-cell" :style="cellStyle"></div>
              </th>
              <th
                class="table-main__cell table-main__index"
                :class="{
                  'table-main__cell--fixed': isFixedLeft(col),
                  'table-main__cell--fixed-left-last': isFixedLeftLast(colIndex),
                }"
                :style="`${isFixedLeft(col) ? `position: sticky; left: ${isShowRowCheckbox && isShowIndex ? '50px' : '0'}` : ''}`"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="indexCol"
                v-else-if="col.key === 'index'"
              >
                <div class="com-cell" :style="cellStyle">{{ $t('trans0454') }}</div>
              </th>
              <th
                class="table-main__cell"
                :class="{
                  'table-main__cell--fixed': isFixedRight(col),
                  'table-main__cell--fixed-right-last': isFixedRightLast(colIndex),
                }"
                :style="`${isFixedRight(col) ? 'position: sticky; right: 0' : ''}`"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="rowOperationCol"
                v-else-if="col.key === 'operation'"
              >
                <div class="com-cell" :style="cellStyle">{{ $t('trans0141') }}</div>
              </th>
              <th
                class="table-main__cell"
                :title="col.title"
                :style="getItemStyle(col)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :ref="col.key"
                v-else
              >
                <div class="cell" :style="cellStyle">{{ col.title }}</div>
              </th>
            </template>
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
              @click="() => clickRow(item)"
            >
              <template v-for="(col, colIndex) in leafColumns" :key="col.key">
                <td
                  class="table-main__cell table-main__checkbox"
                  :class="{
                    'table-main__cell--fixed': isFixedLeft(col),
                    'table-main__cell--fixed-left-last': isFixedLeftLast(colIndex),
                  }"
                  :style="`${isFixedLeft(col) ? 'position: sticky; left: 0' : ''}`"
                  v-if="col.key === 'checkbox'"
                >
                  <div class="com-cell" :style="cellStyle">
                    <fh-checkbox @change="(val) => select(val, item)" />
                  </div>
                </td>
                <td
                  class="table-main__cell table-main__index"
                  :class="{
                    'table-main__cell--fixed': isFixedLeft(col),
                    'table-main__cell--fixed-left-last': isFixedLeftLast(colIndex),
                  }"
                  :style="`${isFixedLeft(col) ? `position: sticky; left: ${isShowRowCheckbox && isShowIndex ? '50px' : '0'}` : ''}`"
                  v-else-if="col.key === 'index'"
                >
                  <div class="com-cell" :style="cellStyle">{{ index + 1 }}</div>
                </td>
                <td
                  class="table-main__cell"
                  :class="{
                    'table-main__cell--fixed': isFixedRight(col),
                    'table-main__cell--fixed-right-last': isFixedRightLast(colIndex),
                  }"
                  :style="`${isFixedRight(col) ? 'position: sticky; right: 0' : ''}`"
                  v-else-if="col.key === 'operation'"
                >
                  <div class="com-cell" :style="cellStyle">
                    <slot name="operation" :row="item"></slot>
                  </div>
                </td>
                <td class="table-main__cell" :style="getItemStyle(col)" v-else>
                  <div class="cell" :style="cellStyle" :title="item[col.key]">
                    <slot :name="col.key" :row="item">
                      {{ item[col.key] ? item[col.key] : '-' }}
                    </slot>
                  </div>
                </td>
              </template>
            </tr>
          </template>
          <tr class="table-main__content-row empty-row" v-else>
            <td class="empty-row__cell" :colspan="leafColumns.length">
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
/**
 * 从多维对象数组中提取指定维度的数据
 * @param {Array} array - 多维对象数组
 * @param {number} targetDepth - 目标维度（从0开始）
 * @param {string} childrenKey - 包含子数组的属性名（默认为'children'）
 * @returns {Array} 包含指定维度所有元素的数组（不包含子维度）
 */
function extractDimension(array, targetDepth, childrenKey = 'children') {
  // 参数验证
  if (!Array.isArray(array)) {
    throw new TypeError('第一个参数必须是数组')
  }

  if (typeof targetDepth !== 'number' || targetDepth < 0) {
    throw new TypeError('目标维度必须是非负整数')
  }

  if (typeof childrenKey !== 'string') {
    throw new TypeError('子维度键名必须是字符串')
  }

  const result = []

  /**
   * 递归遍历多维数组
   * @param {Array} currentArray - 当前处理的数组
   * @param {number} currentDepth - 当前深度
   */
  function traverse(currentArray, currentDepth) {
    for (const item of currentArray) {
      // 检查是否是对象（处理对象数组）
      const isObject = item !== null && typeof item === 'object' && !Array.isArray(item)

      if (currentDepth === targetDepth) {
        // 到达目标维度，提取数据

        // 克隆对象，排除子维度
        if (isObject) {
          const clonedItem = { ...item }
          result.push(clonedItem)
        } else {
          // 非对象元素直接添加
          result.push(item)
        }
      } else if (isObject && item[childrenKey] && Array.isArray(item[childrenKey])) {
        // 继续遍历子维度
        traverse(item[childrenKey], currentDepth + 1)
      }
    }
  }

  traverse(array, 0)
  return result
}
/**
 * 将嵌套的列数组扁平化，将所有子列提取到一个一维数组中。
 * @param {Array} columns - 包含嵌套列对象的数组，每个列对象可能包含 `children` 属性，该属性是一个子列数组。
 * @returns {Array} - 扁平化后的一维列数组。
 */
function flatten(columns) {
  return columns.reduce((acc, col) => {
    if (Array.isArray(col.children) && col.children.length > 0) {
      return [...acc, ...flatten(col.children)]
    }
    return [...acc, col]
  }, [])
}
const Fixed = {
  left: 'left',
  right: 'right',
}
export default {
  name: 'FhTable',
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
    showRowCheckbox: {
      type: Boolean,
      default: true,
    },
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
    fixed: {
      type: Boolean,
      default: true,
    }, // 受否固定列，
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
    isShowOperation() {
      return this.$slots.operation
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
    columnsNew() {
      let list = []
      if (this.isShowRowCheckbox) {
        list.push({
          key: 'checkbox',
          title: '',
          fixed: Fixed.left,
        })
      }
      if (this.isShowIndex) {
        list.push({
          key: 'index',
          title: '',
          fixed: Fixed.left,
        })
      }
      list = [...list, ...this.columns]
      if (this.isShowOperation) {
        list.push({
          key: 'operation',
          title: '',
          fixed: Fixed.right,
        })
      }
      return list
    },
    maxLevel() {
      // 计算表头的最大深度
      const calculateMaxLevel = (columns, currentLevel = 1) => {
        return columns.reduce((max, col) => {
          if (Array.isArray(col.children) && col.children.length > 0) {
            return Math.max(max, calculateMaxLevel(col.children, currentLevel + 1))
          }
          return max
        }, currentLevel)
      }
      return calculateMaxLevel(this.columnsNew)
    },
    leafColumns() {
      // 扁平化的叶子列（最底层列，用于数据渲染）
      return flatten(this.columnsNew)
    },
    headerRows() {
      // 生成表头行数据
      if (this.maxLevel <= 1) return [this.leafColumns]
      const rows = []
      for (let level = 0; level < this.maxLevel; level++) {
        let item = extractDimension(this.columnsNew, level)
        item = item.map((col) => {
          const hasChildren = Array.isArray(col.children) && col.children.length > 0
          if (hasChildren) {
            return {
              colspan: col.children.length,
              rowspan: 1,
              ...col,
            }
          } else {
            return {
              colspan: 1,
              rowspan: this.maxLevel - level,
              ...col,
            }
          }
        })
        rows.push(item)
      }
      return rows
    },
  },
  watch: {
    dataSource(val, oldVal) {
      if (val.length !== oldVal.length) {
        this.checkScrollLeft()
      }
    },
  },
  emits: ['select', 'click-row'],
  methods: {
    isFixedLeft(col) {
      return col.fixed === Fixed.left && this.isShowScroll && this.isScrollRight
    },
    isFixedLeftLast(index) {
      return this.leafColumns[index + 1]?.fixed !== Fixed.left
    },
    isFixedRight(col) {
      return (
        this.$slots.operation && col.fixed === Fixed.right && this.isShowScroll && this.isScrollLeft
      )
    },
    isFixedRightLast(index) {
      return this.leafColumns[index - 1]?.fixed !== Fixed.right
    },
    getItemStyle(col) {
      return this.dataSource.length
        ? {
            width: col.width && `${col.width}px`,
            minWidth: col.width && `${col.width}px`,
            maxWidth: col.width && `${col.width}px`,
          }
        : {}
    },
    handleScroll() {
      // todo 优化滚动
      if (!this.isShowScroll) {
        return
      }
      const offset = 20
      let offsetRight = 0
      let fixedElClientWidth = 0
      if (this.$refs.checkboxCol) {
        fixedElClientWidth += this.$refs.checkboxCol[0].clientWidth
      }
      if (this.$refs.indexCol) {
        fixedElClientWidth += this.$refs.indexCol[0].clientWidth
      }
      const offsetLeft = Math.min(fixedElClientWidth, offset)
      if (this.$refs.headerOperationCol) {
        const operationColClientWidth = this.$refs.headerOperationCol[0].clientWidth
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
    clickRow(item) {
      this.$emit('click-row', item)
    },
    checkScrollLeft() {
      this.$nextTick(() => {
        this.isShowScroll = this.$refs.scrollTable.scrollWidth > this.$refs.tableWrap.clientWidth
        if (this.isShowScroll) {
          this.isScrollLeft = true
        }
      })
    },
  },
  mounted() {
    this.checkScrollLeft()
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
  .table__filter-group,
  .table__operation-group {
    position: absolute;
    top: 20px;
    display: flex;
    align-items: center;
    > * {
      margin: 0 4px;
    }
  }
  .table__filter-group {
    left: 0;
  }
  .table__operation-group {
    right: 0;
  }
  .table__main {
    min-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .table__footer {
    padding: 10px 0;
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
        z-index: 2;
        background-color: @table-background-color;
        &.table-main__cell--fixed-left-last,
        &.table-main__cell--fixed-right-last {
          &::after {
            position: absolute;
            top: 0;
            bottom: -1px;
            width: 30px;
            transition: box-shadow 0.3s;
            content: '';
            pointer-events: none;
          }
        }
        &.table-main__cell--fixed-left-last {
          &::after {
            right: 0;
            transform: translate(100%);
            box-shadow: inset 10px 0 8px -8px #ccc;
          }
        }
        &.table-main__cell--fixed-right-last {
          &::after {
            left: 0;
            transform: translate(-100%);
            box-shadow: inset -10px 0 8px -8px #ccc;
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
