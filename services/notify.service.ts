import { db } from '@/db';
import { notify } from '@/db/schemas';
import { count, eq } from 'drizzle-orm';


export const insertNotify = async (title: string, content: string, checked = false) => {
    try {
        const result = await db.insert(notify).values({
            title,
            content,
            checked,
            date: new Date().toISOString()

        }).returning();


        return result;
    } catch (error) {

        throw error;
    }
};

export const getNotify = async (): Promise<any[]> => {
    try {
        const result = await db.select().from(notify);
        return result;
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
    }
};
export const getUnreadNotificationCount = async (): Promise<number> => {
    try {
        const result = await db
            .select({ count: count() })
            .from(notify)
            .where(eq(notify.checked, false)); // ou isNull(notify.readAt)

        return result[0]?.count || 0;
    } catch (error) {
        console.error('Erro ao contar notificações não lidas:', error);
        return 0;
    }
};
export const getNotifyById = async (notifyId: number) => {
    try {
        const result = await db.select().from(notify).where(eq(notify.id, notifyId));
        return result;
    } catch (error) {
        console.error('Erro ao buscar notificação por ID:', error);
        return null;
    }
};

export const deleteNotifyById = async (notifyId: number) => {
    try {
        await db.delete(notify).where(eq(notify.id, notifyId));
        return true;
    }
    catch (error) {
        console.error('Erro ao deletar notificação por ID:', error);
        return false;
    }
}