<script lang="ts" setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
</script>

<template>
    <OverlayScrollbarsComponent :defer="true" :options="defaultOverlayscrollbarsOptions" class=":uno: h-full">
        <div class=":uno: min-h-full flex flex-col">
            <slot />
        </div>
    </OverlayScrollbarsComponent>
</template>

<style lang="scss" src="~/assets/styles/app.scss" />
