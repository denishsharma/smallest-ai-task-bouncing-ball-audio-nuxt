import type { OverlayScrollbarsComponentProps } from "overlayscrollbars-vue";

type OverlayScrollbarsOptions = OverlayScrollbarsComponentProps["options"];

export const defaultOverlayscrollbarsOptions: OverlayScrollbarsOptions = {
    overflow: {
        x: "hidden",
    },
    scrollbars: {
        autoHide: "move",
        clickScroll: true,
    },
};
