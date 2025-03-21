<script setup lang="ts">
import { defineProps } from 'vue';

interface ButtonProps {
  label: string;
  type?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  icon: ''
});

// Computed classes based on props
const getButtonClasses = () => {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center';

  // Type classes
  const typeClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  // Size classes
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  // Disabled class
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return `${baseClasses} ${typeClasses[props.type]} ${sizeClasses[props.size]} ${disabledClass}`;
};
</script>

<template>
  <button :class="getButtonClasses()" :disabled="disabled">
    <!-- Loading Spinner -->
    <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icon (if provided) -->
    <span v-if="icon && !loading" class="mr-2">
      <i :class="icon"></i>
    </span>

    <!-- Label -->
    <span>{{ label }}</span>
  </button>
</template>
