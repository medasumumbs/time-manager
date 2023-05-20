import { useParams, Navigate } from "react-router-dom";

export default function TodoDetails(props){
    const { key } = useParams();
    const deed = props.getDeed(key);
    if (!props.currentUser){
        return <Navigate to="/login" replace/>
    }
    return (
        <section>
            {deed.done && <p className="has-text-success">Выполнено</p>}
            <h1>{deed.title}</h1>
            <p>{deed.createdAt}</p>
            {deed.desc && <p>{deed.desc}</p>}
            {
                deed.image && 
                <p>
                    <img 
                        src={deed.image}
                        alt="Иллюстрация"
                    >
                    </img>
                </p>
            }
        </section>
    );
}