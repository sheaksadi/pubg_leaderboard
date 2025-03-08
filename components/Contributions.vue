<script setup lang="ts">
import { ref, computed } from 'vue'
import 'echarts'

const props = defineProps({
  contributionData: {
    type: Array,
    default: () => []
  },
  startDate: {
    type: [Date, String],
    default: null
  },
  endDate: {
    type: [Date, String],
    default: null
  }
})

// Color schemes and other utilities remain unchanged

const colorSchemes = {
  light: {
    background: 'transparent',
    text: '#24292e',
    secondaryText: '#586069',
    borderColor: '#fff',
    heatmapColors: ['rgba(235, 237, 240, 0.2)', '#9be9a8', '#40c463', '#30a14e', '#216e39']
  },
}

const colorScheme = computed(() => colorSchemes.light)

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const parseDate = (date: Date | string) => {
  return typeof date === 'string' ? new Date(date) : new Date(date)
}

const generateData = (start: Date, end: Date) => {
  const data = []
  const currentDate = new Date(start)

  while (currentDate <= end) {
    let value = 0
    const rand = Math.random()
    if (rand < 0.5) value = 0
    else if (rand < 0.8) value = Math.floor(Math.random() * 3)
    else if (rand < 0.95) value = Math.floor(Math.random() * 5) + 3
    else value = Math.floor(Math.random() * 3) + 8

    data.push({
      date: formatDate(currentDate),
      contributions: value
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }
  return data
}
const effectiveEndDate = computed(() => {
  if (props.endDate) return parseDate(props.endDate)
  if (props.contributionData.length > 0) {
    const dates = props.contributionData.map(item => new Date(item.date))
    return new Date(Math.max(...dates.map(d => d.getTime())))
  }
  return new Date()
})

const effectiveStartDate = computed(() => {
  if (props.startDate) return parseDate(props.startDate)
  const date = new Date(effectiveEndDate.value)
  date.setFullYear(date.getFullYear() - 1)
  return date
})

const getMonths = (start: Date, end: Date) => {
  const months = []
  const currentDate = new Date(start)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  while (currentDate <= end) {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
    if (!months.find(m => m.key === monthKey)) {
      months.push({
        key: monthKey,
        label: monthNames[currentDate.getMonth()]
      })
    }
    currentDate.setDate(currentDate.getDate() + 15)
  }
  return months
}

const months = computed(() => getMonths(effectiveStartDate.value, effectiveEndDate.value))

const chartInstance = ref(null)

const processedData = computed(() => {
  const start = effectiveStartDate.value
  const end = effectiveEndDate.value
  const dataSource = props.contributionData.length > 0
      ? props.contributionData
      : generateData(start, end)

  // Create complete date set for the range
  const dateMap = new Map()
  const currentDate = new Date(start)
  while (currentDate <= end) {
    dateMap.set(formatDate(currentDate), 0)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Merge with actual data
  dataSource.forEach(item => {
    dateMap.set(item.date, item.contributions)
  })

  return Array.from(dateMap.entries()).map(([date, contributions]) => [date, contributions])
})

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    position: 'top',
    formatter: (params) => {
      const count = params.value[1]
      const date = params.value[0]
      return `<div style="font-size: 12px; color: ${colorScheme.value.secondaryText}">${date}</div>
      <div style="font-size: 16px">${count === 0 ? 'No contributions' : `${count} contributions`}</div>`
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textStyle: { color: '#24292e' },
    borderRadius: 6,
    padding: 10,
    extraCssText: 'backdrop-filter: blur(5px);'
  },
  visualMap: {
    show: false,
    min: 0,
    max: 10,
    inRange: {
      color: colorScheme.value.heatmapColors
    }
  },
  calendar: {
    top: 30,
    left: 30,
    right: 30,
    cellSize: [14, 14],
    range: [formatDate(effectiveStartDate.value), formatDate(effectiveEndDate.value)],
    dayLabel: {
      firstDay: 0,
      nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      show: true,
      color: colorScheme.value.secondaryText,
      fontSize: 10
    },
    monthLabel: { show: false },
    yearLabel: { show: false },
    itemStyle: {
      borderWidth: 1,  // Remove cell borders
      borderColor: 'transparent',  // Transparent border
      color: 'rgba(0,0,0,0)'  // Fully transparent background for calendar cells
    },
    splitLine: { show: false }
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: processedData.value,
    // Add cell style configuration
    itemStyle: {
      borderWidth: 0,
      borderRadius: 2
    }
  }
}))

const onChartInit = (chart) => {
  chartInstance.value = chart
}
</script>

<template>
  <div class="calendar-container">
    <h2 class="heading">
      <span class="text-normal">
        {{ months[0]?.label }} {{ effectiveStartDate.getDate() }} {{ effectiveStartDate.getFullYear() }} –
        {{ months[months.length - 1]?.label }} {{ effectiveEndDate.getDate() }} {{ effectiveEndDate.getFullYear() }}
      </span>
    </h2>
    <div class="month-labels">
      <div v-for="(month, index) in months" :key="index" class="month-label">
        {{ month.label }}
      </div>
    </div>
    <VChart class="chart" :option="option" @init="onChartInit" />
    <div class="legend">
      <span class="legend-text">Less</span>
      <ul class="legend-squares">
        <li v-for="(color, index) in colorScheme.heatmapColors" :key="index" class="legend-square" :style="{ backgroundColor: color }" />
      </ul>
      <span class="legend-text">More</span>
    </div>
  </div>
</template>


<style scoped>
.calendar-container {
  max-width: 56rem;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #24292e;
  background-color: transparent;
  transition: all 0.3s ease;
}

.calendar-container.dark-mode {
  color: #c9d1d9;
}

.heading {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.625rem;
}

.text-normal {
  font-weight: 400;
  color: #586069;
}

.dark-mode .text-normal {
  color: #8b949e;
}

.month-labels {
  display: flex;
  justify-content: space-around;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  margin-bottom: -1.25rem;
  position: relative;
  z-index: 10;
}

.month-label {
  font-size: 0.625rem;
  color: #586069;
}

.dark-mode .month-label {
  color: #8b949e;
}

.chart {
  height: 10rem;
  width: 100%;
}

.legend {
  margin-top: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.625rem;
}

.legend-text {
  color: #586069;
  margin: 0 0.25rem;
}

.dark-mode .legend-text {
  color: #8b949e;
}

.legend-squares {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.legend-square {
  width: 0.625rem;
  height: 0.625rem;
  margin: 0 0.0625rem;
  border: 1px solid rgba(27, 31, 35, 0.06);
}

.dark-mode .legend-square {
  border: 1px solid rgba(240, 246, 252, 0.06);
}
</style>