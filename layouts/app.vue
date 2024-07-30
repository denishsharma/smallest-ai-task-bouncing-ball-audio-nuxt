<script lang="ts" setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
</script>

<template>
    <OverlayScrollbarsComponent :defer="true" :options="{ overflow: { x: 'hidden' }, scrollbars: { autoHide: 'move', clickScroll: true } }" class=":uno: h-full">
        <div class=":uno: min-h-full flex flex-col">
            <slot />
        </div>
    </OverlayScrollbarsComponent>
</template>

<style lang="scss" src="~/assets/styles/app.scss" />
