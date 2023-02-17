import { Link } from "react-router-dom"

import Container from "./Container"

import styles from './Navbar.module.css'
import logo from '../../img/img1.png'

function Navbar() {
    return (
        <div class={styles.navbar}>
            <Container>
                <Link to="/">
                    <img src={logo} alt="Projeto" />
                </Link>
                <ul class={styles.list}>
                    <li class={styles.item}>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li class={styles.item}>
                        <Link to="/contact">Contato</Link>
                    </li>
                    <li class={styles.item}>
                        <Link to="/company">Empresa</Link>
                    </li>
                    <li class={styles.item}>
                        <Link to="/newproject">Novo Projeto</Link>
                    </li>
                </ul>

            </Container>
        </div>
    )
}

export default Navbar
