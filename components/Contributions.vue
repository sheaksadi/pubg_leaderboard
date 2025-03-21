<script setup lang="ts">
import 'echarts'

interface Props {
    durationData?: { date: string; duration: number }[];
    startDate?: Date | string | null;
    endDate?: Date | string | null;
}

const props = withDefaults(defineProps<Props>(), {
    durationData: () => [],
    startDate: null,
    endDate: null
});

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

const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 mins'
    if (minutes < 60) return `${minutes} mins`
    const hours = Math.floor(minutes / 60)
    const remainingMins = minutes % 60
    if (remainingMins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMins} mins`
}

const generateData = (start: Date, end: Date) => {
    const data = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
        let minutes = 0
        const rand = Math.random()
        if (rand < 0.5) minutes = 0
        else if (rand < 0.8) minutes = Math.floor(Math.random() * 60) // 0-59 mins
        else if (rand < 0.95) minutes = Math.floor(Math.random() * 120) + 60 // 1-3 hours
        else minutes = Math.floor(Math.random() * 240) + 180 // 3-7 hours

        data.push({
            date: formatDate(currentDate),
            duration: minutes
        })

        currentDate.setDate(currentDate.getDate() + 1)
    }
    return data
}

const effectiveEndDate = computed(() => {
    if (props.endDate) return parseDate(props.endDate)
    if (props.durationData.length > 0) {
        const dates = props.durationData.map(item => new Date(item.date))
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
    const months: { key: string, label: string }[] = []
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
const currentCellSize = ref([14, 14]) // Default size

const processedData = computed(() => {
    const start = effectiveStartDate.value
    const end = effectiveEndDate.value
    const dataSource = props.durationData.length > 0
        ? props.durationData
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
        dateMap.set(item.date, item.duration)
    })

    return Array.from(dateMap.entries()).map(([date, duration]) => [date, duration])
})

const updateCellSize = () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Get the container width
    const container = document.querySelector('.calendar-container') || document.body
    const containerWidth = container.clientWidth

    // Calculate cell size based on container width
    // This is more reliable than using window width
    if (containerWidth < 400) {
        currentCellSize.value = [7, 7]
    } else if (containerWidth < 600) {
        currentCellSize.value = [9, 9]
    } else if (containerWidth < 800) {
        currentCellSize.value = [11, 11]
    } else {
        currentCellSize.value = [14, 14]
    }

    // Update chart if it exists
    if (chartInstance.value) {
        chartInstance.value.setOption({
            calendar: {
                cellSize: currentCellSize.value,
                // Adjust margins for smaller containers
                left: containerWidth < 500 ? 10 : 30,
                right: containerWidth < 500 ? 10 : 30,
                // Ensure top margin to accommodate month labels
                top: 40
            }
        })
        chartInstance.value.resize()
    }
}
const option = computed(() => ({
    backgroundColor: 'transparent',
    tooltip: {
        position: 'top',
        formatter: (params: any) => {
            const minutes = params.value[1]
            const date = params.value[0]
            return `<div style="font-size: 12px; color: ${colorScheme.value.secondaryText}">${date}</div>
      <div style="font-size: 16px">${minutes === 0 ? 'No activity' : formatDuration(minutes)}</div>`
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
        max: 420, // 7 hours in minutes
        inRange: {
            color: colorScheme.value.heatmapColors
        }
    },
    calendar: {
        top: 30,
        left: 30,
        right: 30,
        cellSize: currentCellSize.value,
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
            borderWidth: 1,
            borderColor: 'transparent',
            color: 'rgba(0,0,0,0)'
        },
        splitLine: { show: false }
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: processedData.value,
        itemStyle: {
            borderWidth: 0,
            borderRadius: 2
        }
    }
}))

const onChartInit = (chart) => {
    chartInstance.value = chart
}

// Set up resize listener
const resizeHandler = () => {
    updateCellSize()
}

onMounted(() => {
    updateCellSize() // Initial size calculation
    window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
    <div class="w-full mx-auto font-sans text-gray-800">
        <h2 class="text-sm font-semibold mb-2.5">
            <span class="font-normal text-gray-500">
                {{ months[0]?.label }} {{ effectiveStartDate.getDate() }} {{ effectiveStartDate.getFullYear() }} –
                {{ months[months.length - 1]?.label }} {{ effectiveEndDate.getDate() }} {{
                    effectiveEndDate.getFullYear() }}
            </span>
        </h2>

        <!-- Fixed width container to maintain month alignment -->
        <div class="relative w-full">
            <!-- Month labels - absolute positioning to maintain alignment -->
            <div class="absolute top-0 left-0 right-0 flex justify-around">
                <div v-for="(month, index) in months" :key="index" class="text-xs text-gray-500">
                    {{ month.label }}
                </div>
            </div>

            <!-- Chart with proper spacing -->
            <div class="w-full pt-6">
                <VChart class="w-full h-40 sm:h-48 md:h-56 lg:h-64" :option="option" @init="onChartInit" />
            </div>
        </div>

        <div class="mt-2.5 flex items-center justify-end text-xs">
            <span class="text-gray-500 mx-1">Less</span>
            <ul class="flex list-none m-0 p-0">
                <li v-for="(color, index) in colorScheme.heatmapColors" :key="index"
                    class="w-2.5 h-2.5 mx-0.5 border border-gray-200 border-opacity-10"
                    :style="{ backgroundColor: color }">
                </li>
            </ul>
            <span class="text-gray-500 mx-1">More</span>
        </div>
    </div>
</template>
