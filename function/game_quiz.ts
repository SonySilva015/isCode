// @/services/progress.service.ts
import { getGameLevelById, updateGameLevelStatus } from '@/services/game.service';
import { getCurrentXpLevel, getXpLevels, SetXp, updateXp, updateXp_and_Level } from '@/services/progress_here.service';
import AsyncStorage from '@react-native-async-storage/async-storage';



// =======================
// Types & Interfaces
// =======================

export interface UserProgress {
    level: number;
    xp: number;
    totalXP: number;
    gamesCompleted: number;
    highestScore: number;
    bestStreak: number;
    trophies: string[];
}

export interface GameResult {
    levelId: number;
    score: number;
    accuracy: number;
    maxStreak: number;
    hintsUsed: number;
    completionTime?: number;
}

export interface TrophyAward {
    title: string;
    description: string;
    icon: string;
    condition: (stats: GameResult) => boolean;
}

// =======================
// Constants
// =======================




const STORAGE_KEYS = {
    USER_PROGRESS: '@python_game:user_progress',
    COMPLETED_LEVELS: '@python_game:completed_levels',
    EARNED_TROPHIES: '@python_game:earned_trophies',
    GAME_STATS: '@python_game:game_stats'
};

// =======================
// Core Progress Functions
// =======================

/**
 * Obtém o progresso atual do usuário
 */
export const getCurrentLevel = async (): Promise<{ level: number; xp: number }> => {
    try {
        // Primeiro tenta do banco de dados
        const dbLevels = await getXpLevels();
        if (dbLevels && dbLevels.length > 0) {
            const latestLevel = dbLevels[0];
            return { level: latestLevel.level || 1, xp: latestLevel.xp || 0 };
        }

        // Fallback para AsyncStorage
        const storedProgress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (storedProgress) {
            return JSON.parse(storedProgress);
        }

        // Progresso inicial
        const initialProgress = { level: 1, xp: 0 };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(initialProgress));
        return initialProgress;
    } catch (error) {
        console.error('Erro ao obter nível atual:', error);
        return { level: 1, xp: 0 };
    }
};

//actualizar o estado do nivel
export const handleCompleteLesson = async (levelId: number, xp: number) => {

    const c_level = await getGameLevelById(levelId);
    console.log('Nível atual:', c_level);
    if (c_level?.status !== 'completed') {
        try {
            await updateGameLevelStatus(levelId, 'completed');
            await updateGameLevelStatus(levelId + 1, 'opened');

            const xp_old = await getCurrentXpLevel();
            const xp_current = xp_old?.xp || 0;

            if (xp_current === 0) {
                await SetXp(xp);
            } else if (xp_current >= (xp_old?.nextLevel || 100)) {
                updateXp_and_Level(xp_current + xp, (xp_old?.level || 1) + 1, ((xp_old?.nextLevel || 100) + 100));
            } else {
                await updateXp(xp_current + xp);
            }
        } catch (error) {
            console.error('Erro ao completar lição:', error);
        }
    }
}