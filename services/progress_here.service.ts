// @/services/progress_here.service.ts
import { db } from '@/db';
import { xp_levels } from '@/db/schemas';
import { asc, eq } from 'drizzle-orm';

/* =======================
   Interfaces (ALINHADAS AO SCHEMA)
======================= */

export interface XpLevel {
    id: number;
    level: number | null;
    xp: number | null;
    nextLevel: number | null;

}

export interface Trophy {
    id: number;
    title: string;
    description: string;
    icon: string;
    created_at?: string;
}

export interface NewTrophy {
    title: string;
    description: string;
    icon: string;
}

export interface ProgressSummary {
    xpLevel: XpLevel | null;
    trophies: Trophy[];
    totalTrophies: number;
    earnedTrophies: number;
}

/* =======================
   Helpers
======================= */

const now = () => new Date().toISOString();

/* =======================
   XP LEVELS
======================= */

/**
 * Retorna todos os níveis de XP
 */
export const getXpLevels = async (): Promise<XpLevel[]> => {
    try {
        return await db
            .select()
            .from(xp_levels)
            .orderBy(asc(xp_levels.level));
    } catch (err) {
        console.error('Erro ao buscar níveis de XP:', err);
        return [];
    }
};

/**
 * Retorna o nível atual (registro único)
 */
export const getCurrentXpLevel = async (): Promise<XpLevel | null> => {
    try {
        const [level] = await db
            .select()
            .from(xp_levels)
            .limit(1);
        return level ?? null;
    } catch (err) {
        console.error('Erro ao buscar XP atual:', err);
        return null;
    }
};

/**
 * Define XP (cria ou atualiza)
 */
export const SetXp = async (xp: number): Promise<boolean> => {
    try {
        await db.insert(xp_levels).values({ xp: xp, level: 1, nextLevel: 100 }).onConflictDoUpdate({
            target: [xp_levels.id],
            set: {
                xp: xp,
                level: 1,
                nextLevel: 100
            }
        });
        return true;
    } catch (err) {
        console.error('Erro ao definir XP:', err);
        return false;
    }
};
export const updateXp = async (xp: number): Promise<boolean> => {
    try {
        await db.update(xp_levels).set({ xp: xp }).where(eq(xp_levels.id, 1));
        return true;
    } catch (err) {
        console.error('Erro ao definir XP:', err);
        return false;
    }
};
export const updateXp_and_Level = async (xp: number, level: number, nextLevel: number): Promise<boolean> => {
    try {
        await db.update(xp_levels).set({ xp: xp, level: level, nextLevel: nextLevel }).where(eq(xp_levels.id, 1));
        return true;
    } catch (err) {
        console.error('Erro ao definir XP:', err);
        return false;
    }
};
