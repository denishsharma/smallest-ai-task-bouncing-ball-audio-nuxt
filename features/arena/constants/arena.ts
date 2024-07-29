import type Matter from "matter-js";

export const ARENA_WIDTH = 854;
export const ARENA_HEIGHT = 480;

export const BALL_RADIUS = 10;
export const BALL_PROPERTIES: Matter.IBodyDefinition = {
    restitution: 1,
    frictionAir: 0.008,
    frictionStatic: 2,
    friction: 0.5,
};

export const THROW_ANGLE = Math.PI / 2;
export const THROW_MAGNITUDE = 0.01;

export const SPEED_THRESHOLD = 0.05;
export const BOUNCE_THRESHOLD = 0.5;

export const WALL_AND_FLOOR_THICKNESS = 20;
export const WALL_PROPERTIES: Matter.IChamferableBodyDefinition = {
    isStatic: true,
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    render: {
        fillStyle: "#1C1C1E",
        lineWidth: 1,
    },
};

export const BALL_LABEL_REGEX = /^ball-(?<id>\w+)$/;
export const FLOOR_LABEL_REGEX = /^floor-segment-(?<id>\w+)-(?<word>\w+)$/;
