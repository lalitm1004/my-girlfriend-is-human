import type { GameState } from "$lib/types/gameState.type";
import { writable } from "svelte/store";

export const GameStateStore = writable<GameState | null>(null);
export const IsGameOver = writable<boolean>(false);