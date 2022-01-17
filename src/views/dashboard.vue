<template>
  <div class="mb-3">
    <el-alert type="success" effect="dark" show-icon>
      <template #title>
        欢迎使用三元资讯管理系统 QQ:9563936(唐不歪科技) (
        <a href="http://www.texcellent.com" target="_blank" class="text-white"
          >www.mia999.com</a
        >
        )
      </template>
    </el-alert>
  </div>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { ref, defineComponent, reactive, toRefs, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { DashboardApi } from "@/api/dashboard";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default defineComponent({
  name: "HelloWorld",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  setup() {
    const option = reactive({
      title: {
        text: "APP用户统计",
        left: "left",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: ["今日活跃用户", "用户总数", "会员统计"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "人数", // 序列名称
          data: [],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    });
    const getAppUserStatistics = function () {
      DashboardApi.getAppUserStatistics().then((res) => {
        option.series[0].data = [
          res.data.active_count,
          res.data.user_count,
          res.data.vip_count,
        ];
      });
    };
    onMounted(() => {
      getAppUserStatistics();
    });
    return { getAppUserStatistics, option };
  },
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
