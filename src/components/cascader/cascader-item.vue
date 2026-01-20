<template>
  <li class="cascader-item">
    <div
      class="cascader-item__content"
      :class="{
        'is-selected': isSelected(option),
      }"
      :style="{ paddingLeft: `${option.level * 10 + 10}px` }"
    >
      <fh-icon
        v-if="option.children?.length || option.isSonDict"
        class="cascader__caret input__icon"
        :class="!option.loading && option.isCollapsed ? '' : 'is-reverse'"
        name="icon-down"
        @click.stop="toggleCollapse"
      ></fh-icon>
      <div class="cascader-item__text" @click.stop="selectItem">{{ option.text }}</div>
      <fh-icon
        class="select__caret input__icon"
        name="icon-loading"
        v-if="option.loading && !option.isCollapsed"
      ></fh-icon>
    </div>
    <ul class="cascader-item__children" v-if="option.children?.length" v-show="!option.isCollapsed">
      <cascader-item
        v-for="child in option.children"
        :key="child.value"
        :option="child"
        :selected="selected"
        @toggle="handleToggle"
        @select="handleSelect"
      ></cascader-item>
    </ul>
  </li>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'CascaderItem',
})

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  selected: {
    type: String,
    default: '',
  },
})

const isSelected = (option) => {
  console.log(props.selected, option.value)
  return props.selected === option.value
}
const emit = defineEmits(['select', 'toggle'])

const toggleCollapse = () => {
  emit('toggle', props.option)
}
const selectItem = () => {
  emit('select', props.option)
}
const handleToggle = (option) => {
  emit('toggle', option)
}
const handleSelect = (option) => {
  emit('select', option)
}
</script>

<style lang="less">
.cascader-item {
  list-style: none;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  .cascader-item__content {
    display: flex;
    align-items: center;
    padding: 10px;
    &:active {
      background: @select-item-active-background-color;
      color: @select-item-active-color;
    }
    &:hover {
      background: @select-item-hover-background-color;
      color: @select-item-hover-color;
    }
    &.is-selected {
      color: @select-item-selected-color;
    }
  }
  .cascader-item__text {
    flex: 1;
    padding-left: 5px;
  }
}
</style>
