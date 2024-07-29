export default defineNuxtPlugin(async () => {
    await import("~/services/socket");
});
