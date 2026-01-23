import { db } from '@/db';
import { courses, game, gameLevel, lessons, modules, options, quiz, quizGame, users, xp_levels } from '@/db/schemas';




export async function deleteAllData() {
    try {
        await db.transaction(async (tx) => {
            await tx.delete(xp_levels);
            await tx.delete(quizGame);
            await tx.delete(gameLevel);
            await tx.delete(game);
            await tx.delete(options);
            await tx.delete(quiz);
            await tx.delete(lessons);
            await tx.delete(modules);
            await tx.delete(courses);
            await tx.delete(users);
        });

        return { success: true, message: 'All data has been deleted.' };
    }
    catch (error) {
        console.error('Error deleting data:', error);
        return { success: false, message: 'Failed to delete data.' };
    }
}