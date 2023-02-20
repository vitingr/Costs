import styles from './Loader.module.css'
import img2 from '../../img/img2.svg'

function Loader() {
    return (
        <div className={styles.loader_container}>
            <img className={styles.loader} src={img2} alt="Loading" />
        </div>
    )
}

export default Loader