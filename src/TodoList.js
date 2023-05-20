/*
    &#9745 - Галочка
    &#9746 - Крестик
*/
import { Link, Navigate } from "react-router-dom";

export default function TodoList (props) {
    if (!props.list) {
        console.log("Некорректно передан массив props.list: VVV");
        console.dir(props);
        return 0;
    }
    if (!props.currentUser){
        return <Navigate to="/login" replace/>
    }
    return (
        <section>
            <h1>Дела</h1>
            <table className="table is-hoverable is-fullwidth">
                <tbody>
                    {
                        props.list.map((item) => (
                            <tr key={item.key}>
                                <td>
                                    <Link to={`/${item.key}`}>
                                        {item.done && <del>{item.title}</del>}
                                        {!item.done && item.title}
                                        {!item.title && '-'}
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="button is-success"
                                        title="Пометить как сделанное"
                                        disabled={item.done}
                                        onClick={(e) => props.setDone(item.key)}
                                    >
                                        &#9745;
                                    </button>
                                    <button
                                        className="button is-danger"
                                        title="Удалить"
                                        onClick={(e) => props.delete(item.key)}
                                    >
                                        &#9746;
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
    );
}