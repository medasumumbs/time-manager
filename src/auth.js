import { signInWithEmailAndPassword, signOut, getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export async function register(email, password){
    try {
        const oUC = await createUserWithEmailAndPassword(
            getAuth(),
            email,
            password
        )
        return oUC.user;
    } catch(error){
        return error.code;
    }
}

export async function login(email, password){
    try {
        const oUC = await signInWithEmailAndPassword(getAuth(), email, password);
        return oUC.user;
    } catch (error) {
        return error.code;
    }
}

export async function logout(){
    await signOut(getAuth());
}