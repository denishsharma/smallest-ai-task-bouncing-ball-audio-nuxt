import { ClickScrollPlugin, OverlayScrollbars } from "overlayscrollbars";

export default defineNuxtPlugin((app) => {
    app.hook("app:beforeMount", () => {
        OverlayScrollbars.plugin([ClickScrollPlugin]);
    });
});
