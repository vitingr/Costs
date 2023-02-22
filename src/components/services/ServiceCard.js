import styles from '../services/ServiceCard.module.css'

import { BsFillTrashFill } from 'react-icons/bs'

function ServiceCard({ id, name, cost, description, handleRemove }) {

    const remove = (e) => {
        e.preventDefault()
        handleRemove(id, cost)
    }

    return (
        <div className={styles.project_card}>
            <h4 className={styles.title}>{name}</h4>
            <p>
                <span>Custo Total:</span> R${cost}
            </p>
            <p className={styles.description}>{description}</p>
            <div className={styles.project_card_actions}>
                <button className={styles.excluir} onClick={remove}>
                    <BsFillTrashFill />
                    Remover
                </button>
            </div>
        </div>
    )
}

export default ServiceCard