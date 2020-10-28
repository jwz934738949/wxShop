// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 获取父组件传来的数据
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击导航项
    tabsItemClick(e) {
      // 获取点击的索引
      const {
        index
      } = e.currentTarget.dataset
      // 触发数据回传事件，将index回传给父组件
      this.triggerEvent("tabsItemClick", {index})
    }
  }
})