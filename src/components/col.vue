<template>
    <div class="skeleton-col"></div>
</template>

<script>
export default {
    name: 'Col',
};
</script>

<style>
    .skeleton-col:after {
        content: '';
        position: absolute;
        left: 50%;
        width: 20px;
        height: 20px;
    }
</style>