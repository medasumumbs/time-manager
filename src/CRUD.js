import { getDatabase, ref, push, set, get, remove, query } from 'firebase/database';

export async function add(user, deed){
    const oRef = await push(
        ref(
            getDatabase(),
            `users/${user.uid}/todos`
        )
    );
    await set(oRef, deed);
    const oSnapshot = await get(query(oRef));
    const oDeed = oSnapshot.val();
    oDeed.key = oRef.key;
    return oDeed;
}

export async function getList(user){
    const oArr = [];
    try{
        const oSnapshot = await get(query(ref(getDatabase(),`users/${user.uid}/todos`)));
        let oDeed;
        oSnapshot.forEach((oDoc) => {
            oDeed = oDoc.val();
            oDeed.key = oDoc.key;
            oArr.push(oDeed);
        });
    } catch (error){
        console.error(error);
    }
    return oArr;
}

export async function setDone(user, key){
    return set(ref(getDatabase(), `users/${user.uid}/todos/${key}/done`), true);
}

export function deleteDeed(user, key){
    return remove(ref(getDatabase(),`users/${user.uid}/todos/${key}`));
}