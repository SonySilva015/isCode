// gameQueries.ts
import { db } from '@/db';
import { game, gameLevel, quizGame } from '@/db/schemas';
import { eq } from 'drizzle-orm';

export interface Game {
    id: number;
    title: string | null;
    desc: string | null;
    courseId: number | null;
}

export interface GameLevel {
    id: number;
    level: number | null;
    status: string | null;
    gameId: number | null;
}

export interface QuizGame {
    id: number;
    question: string;
    answer: string;
    game_fk: number | null;
}

export const getLocalCourses = async (): Promise<Game[]> => {
    try {
        const result = await db.select().from(game);
        return result;
    } catch (error) {
        console.error('Erro ao buscar jogos locais:', error);
        return [];
    }
};

export const getLocalGames = async (): Promise<Game[]> => {
    try {
        const result = await db.select().from(game);
        return result;
    } catch (error) {
        console.error('Erro ao buscar jogos locais:', error);
        return [];
    }
};

export const getGameLevels = async (gameId: number): Promise<GameLevel[]> => {
    try {
        const result = await db.select()
            .from(gameLevel)
            .where(eq(gameLevel.gameId, 1))
            .orderBy(gameLevel.level);
        return result;
    } catch (error) {
        console.error('Erro ao buscar níveis do jogo:', error);
        return [];
    }
};

export const getQuizGames = async (gameLevelId: number): Promise<QuizGame[]> => {
    try {
        const result = await db.select()
            .from(quizGame)
            .where(eq(quizGame.game_fk, gameLevelId));
        return result;
    } catch (error) {
        console.error('Erro ao buscar quizzes:', error);
        return [];
    }
};

export const getGameById = async (gameId: number): Promise<Game | null> => {
    try {
        const result = await db.select()
            .from(game)
            .where(eq(game.id, gameId))
            .limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        return null;
    }
};

export const getGameLevelById = async (levelId: number): Promise<GameLevel | null> => {
    try {
        const result = await db.select()
            .from(gameLevel)
            .where(eq(gameLevel.id, levelId))
            .limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Erro ao buscar nível:', error);
        return null;
    }
};

export const updateGameLevelStatus = async (levelId: number, status: string): Promise<void> => {
    try {
        await db.update(gameLevel)
            .set({ status: status })
            .where(eq(gameLevel.id, levelId));
    } catch (error) {
        console.error('Erro ao atualizar status do nível:', error);
    }
};
