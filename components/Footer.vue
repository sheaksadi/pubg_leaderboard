<script setup lang="ts">

</script>

<template>
 <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <!-- Social Links and Contact -->
            <div class="flex items-center space-x-6">
                <!-- Discord Link -->
                <a href="https://discord.com" target="_blank" class="text-gray-400 hover:text-white transition duration-300">
                    <Icon name="fa6-brands:discord" />
                </a>
                <!-- Facebook Link -->
                <a href="https://facebook.com" target="_blank" class="text-gray-400 hover:text-white transition duration-300">
                    <Icon name="fa6-brands:facebook" />
                </a>
                <!-- Contact Number -->
                <p class="text-gray-400 flex items-center">
                    <Icon name="fa6-solid:phone" class="mr-2" /> +1 (234) 567-890
                </p>
            </div>

            <!-- Developer Section -->
            <div class="text-gray-400">
                Developed by <a href="https://sadi.dev" target="_blank" class="text-purple-400 hover:text-purple-300 transition duration-300">Sheak Sadi</a>
            </div>

            <!-- Copyright Notice -->
            <div class="text-gray-400">
                &copy; 2025 Syco.gg. All Rights Reserved.
            </div>
        </div>
    </div>
</footer>
</template>

<style scoped>

</style>