<script lang="ts" setup>
import { SCENE_ADD_RANDOM_BALL, SCENE_BALL_HIT_FLOOR, type SceneAddBallEventPayload, type SceneBallHitFloorEventPayload } from "~/features/arena/constants/events";

definePageMeta({
    layout: "app",
});

const eventSceneAddRandomBall = useEventBus<SceneAddBallEventPayload>(SCENE_ADD_RANDOM_BALL);
const eventSceneBallHitFloor = useEventBus<SceneBallHitFloorEventPayload>(SCENE_BALL_HIT_FLOOR);

const { space } = useMagicKeys();

whenever(space, () => {
    eventSceneAddRandomBall.emit({});
});

eventSceneBallHitFloor.on((data) => {
    console.log(data);
});
</script>

<template>
    <div class=":uno: grow py-14">
        <div class=":uno: hide-scrollbars mx-a flex items-stretch overflow-x-scroll">
            <div class=":uno: w-10 shrink-0" />
            <div class=":uno: flex flex grow flex-col items-center">
                <ArenaFeature />
            </div>
            <div class=":uno: w-10 shrink-0" />
        </div>
    </div>
</template>
