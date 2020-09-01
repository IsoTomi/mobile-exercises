<template>
  <view class="container">
    <text class="date">{{item.date}}</text>
    <meal-item
      class="text-container"
      v-for="meal in meals"
      :key="meal.title_fi"
      :item="meal"
    />
  </view>
</template>

<script>
import MealItem from "./MealItem"

export default {
  components: {
    MealItem
  },
  props: {
    item: {
      Type: Object
    }
  },
  data() {
    return {
      meals: this.item.courses
    };
  }
};
</script>

<style>
  .container {
    margin: 10;
  }
  .date {
    color:coral;
    font-size: 20px;
  }
</style>